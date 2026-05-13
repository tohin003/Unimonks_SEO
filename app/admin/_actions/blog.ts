"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAdminContext } from "@/lib/auth/current-user";
import { getDb } from "@/lib/db/client";
import {
  blogPosts as blogPostsTable,
  mediaAssets,
} from "@/lib/db/schema";
import {
  deletePost as deletePostFallback,
  savePost as savePostFallback,
  slugify,
  toPost,
  type CoverImage,
  type Post,
} from "@/lib/posts";

import { recordAudit } from "./audit";

export const BlogPostInputSchema = z.object({
  slug: z.string().max(160).optional().default(""),
  title: z.string().min(1).max(280),
  description: z.string().min(1).max(500),
  excerpt: z.string().min(1).max(1000),
  category: z.string().min(1).max(120),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  readingTime: z.string().min(1).max(40),
  seoQuery: z.string().min(1).max(280),
  quickAnswer: z.string().min(1).max(2000),
  takeaways: z.array(z.string().min(1).max(500)).max(20),
  body: z.string().min(1).max(50000),
  published: z.boolean(),
  coverImageAssetId: z
    .string()
    .uuid("Cover image must reference a valid asset")
    .nullable()
    .optional(),
});

export type BlogPostInput = z.infer<typeof BlogPostInputSchema>;

export type SavePostResult =
  | { ok: true; post: Post; posts: Post[]; message?: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export type DeletePostResult =
  | { ok: true; posts: Post[]; message?: string }
  | { ok: false; message: string };

async function readAllPosts(): Promise<Post[]> {
  const db = getDb();
  if (!db) return [];
  const rows = await db
    .select({ post: blogPostsTable, cover: mediaAssets })
    .from(blogPostsTable)
    .leftJoin(mediaAssets, eq(blogPostsTable.coverImageAssetId, mediaAssets.id));

  return rows
    .map(({ post: row, cover }) => {
      const coverImage: CoverImage | null =
        cover && cover.deletedAt === null && row.coverImageAssetId
          ? {
              assetId: cover.id,
              publicUrl: cover.publicUrl,
              alt: cover.altText ?? "",
              width: cover.width,
              height: cover.height,
            }
          : null;
      return {
        slug: row.slug,
        title: row.title,
        description: row.description,
        excerpt: row.excerpt,
        category: row.category,
        date: row.date,
        readingTime: row.readingTime,
        seoQuery: row.seoQuery,
        quickAnswer: row.quickAnswer,
        takeaways: row.takeaways ?? [],
        body: row.body,
        published: row.published,
        updatedAt: row.updatedAt?.toISOString(),
        coverImage,
      };
    })
    .map(toPost)
    .sort((a, b) =>
      (b.updatedAt ?? b.date).localeCompare(a.updatedAt ?? a.date),
    );
}

export async function savePostAction(
  input: BlogPostInput,
  existingSlug?: string,
): Promise<SavePostResult> {
  const ctx = await getAdminContext();
  if (!ctx.authenticated) {
    return { ok: false, message: "Not authenticated." };
  }

  const parsed = BlogPostInputSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { ok: false, message: "Some fields are invalid.", fieldErrors };
  }

  const db = getDb();
  if (!db) {
    // Fall back to the legacy JSON-file save path. This is what runs in
    // local dev when DATABASE_URL isn't set, matching the prior behaviour.
    try {
      const savedRecord = await savePostFallback(parsed.data, existingSlug);
      const posts = await import("@/lib/posts").then((m) =>
        m.getPosts({ includeDrafts: true }),
      );
      return {
        ok: true,
        post: savedRecord,
        posts,
        message:
          "Saved locally (data/posts.json). Production needs DATABASE_URL for persistence.",
      };
    } catch (error) {
      return {
        ok: false,
        message:
          (error instanceof Error && error.message) ||
          "Could not save post to local file.",
      };
    }
  }

  try {
    const targetSlug = slugify(
      parsed.data.slug || parsed.data.title || existingSlug || "",
    );
    if (!targetSlug) {
      return { ok: false, message: "Title or slug is required." };
    }

    const before = await db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.slug, existingSlug ?? targetSlug));

    // Slug-conflict check when the slug is changing.
    if (targetSlug !== existingSlug) {
      const conflict = await db
        .select()
        .from(blogPostsTable)
        .where(eq(blogPostsTable.slug, targetSlug))
        .limit(1);
      if (conflict.length > 0) {
        return {
          ok: false,
          message: "Another post already uses this slug.",
        };
      }
    }

    const values = {
      slug: targetSlug,
      title: parsed.data.title,
      description: parsed.data.description,
      excerpt: parsed.data.excerpt,
      category: parsed.data.category,
      date: parsed.data.date,
      readingTime: parsed.data.readingTime,
      seoQuery: parsed.data.seoQuery,
      quickAnswer: parsed.data.quickAnswer,
      takeaways: parsed.data.takeaways,
      body: parsed.data.body,
      published: parsed.data.published,
      coverImageAssetId: parsed.data.coverImageAssetId ?? null,
      updatedAt: new Date(),
    };

    if (existingSlug && before.length > 0) {
      await db
        .update(blogPostsTable)
        .set(values)
        .where(eq(blogPostsTable.slug, existingSlug));
    } else {
      await db.insert(blogPostsTable).values(values);
    }

    const afterRows = await db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.slug, targetSlug));
    const after = afterRows[0];

    await recordAudit({
      user: ctx.user,
      action: existingSlug ? "update" : "create",
      entityType: "blog_post",
      entityId: targetSlug,
      before: before[0],
      after,
    });

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${targetSlug}`);
    if (existingSlug && existingSlug !== targetSlug) {
      revalidatePath(`/blog/${existingSlug}`);
    }
    revalidatePath("/sitemap.xml");

    const posts = await readAllPosts();
    const saved = posts.find((p) => p.slug === targetSlug);
    if (!saved) {
      return {
        ok: false,
        message: "Post saved but could not be re-read from the DB.",
      };
    }

    return {
      ok: true,
      post: saved,
      posts,
      message: parsed.data.published
        ? "Published. /blog and /sitemap.xml will refresh shortly."
        : "Draft saved.",
    };
  } catch (error) {
    console.error("[admin] savePostAction failed", error);
    return { ok: false, message: "Could not save post." };
  }
}

export async function deletePostAction(slug: string): Promise<DeletePostResult> {
  const ctx = await getAdminContext();
  if (!ctx.authenticated) {
    return { ok: false, message: "Not authenticated." };
  }

  const db = getDb();
  if (!db) {
    try {
      const removed = await deletePostFallback(slug);
      if (!removed) return { ok: false, message: "Post not found." };
      const posts = await import("@/lib/posts").then((m) =>
        m.getPosts({ includeDrafts: true }),
      );
      return { ok: true, posts, message: "Deleted locally." };
    } catch (error) {
      return {
        ok: false,
        message:
          (error instanceof Error && error.message) ||
          "Could not delete post.",
      };
    }
  }

  try {
    const before = await db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.slug, slug));
    if (before.length === 0) {
      return { ok: false, message: "Post not found." };
    }

    await db.delete(blogPostsTable).where(eq(blogPostsTable.slug, slug));

    await recordAudit({
      user: ctx.user,
      action: "delete",
      entityType: "blog_post",
      entityId: slug,
      before: before[0],
    });

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/sitemap.xml");

    const posts = await readAllPosts();
    return { ok: true, posts, message: "Post deleted." };
  } catch (error) {
    console.error("[admin] deletePostAction failed", error);
    return { ok: false, message: "Could not delete post." };
  }
}

