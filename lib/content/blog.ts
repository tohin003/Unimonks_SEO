import { and, desc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import {
  blogPosts as blogPostsTable,
  mediaAssets,
} from "@/lib/db/schema";
import {
  getFeaturedPosts as getFeaturedPostsFallback,
  getPostBySlug as getPostBySlugFallback,
  getPosts as getPostsFallback,
  getRelatedPosts as getRelatedPostsFallback,
  toPost,
  type CoverImage,
  type Post,
  type PostRecord,
} from "@/lib/posts";

type JoinedBlogRow = {
  post: typeof blogPostsTable.$inferSelect;
  cover: typeof mediaAssets.$inferSelect | null;
};

function rowToRecord({ post, cover }: JoinedBlogRow): PostRecord {
  const coverImage: CoverImage | null =
    cover && cover.deletedAt === null && post.coverImageAssetId
      ? {
          assetId: cover.id,
          publicUrl: cover.publicUrl,
          alt: cover.altText ?? "",
          width: cover.width,
          height: cover.height,
        }
      : null;

  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    excerpt: post.excerpt,
    category: post.category,
    date: post.date,
    readingTime: post.readingTime,
    seoQuery: post.seoQuery,
    quickAnswer: post.quickAnswer,
    takeaways: post.takeaways ?? [],
    body: post.body,
    published: post.published,
    updatedAt: post.updatedAt ? post.updatedAt.toISOString() : undefined,
    coverImage,
  };
}

function sortByUpdatedDesc(a: PostRecord, b: PostRecord) {
  const aStamp = a.updatedAt ?? a.date;
  const bStamp = b.updatedAt ?? b.date;
  return bStamp.localeCompare(aStamp);
}

export async function getPosts(options?: {
  includeDrafts?: boolean;
}): Promise<Post[]> {
  const db = getDb();
  if (!db) return getPostsFallback(options);

  try {
    const rows = await db
      .select({ post: blogPostsTable, cover: mediaAssets })
      .from(blogPostsTable)
      .leftJoin(mediaAssets, eq(blogPostsTable.coverImageAssetId, mediaAssets.id))
      .orderBy(desc(blogPostsTable.updatedAt));

    if (rows.length === 0) return getPostsFallback(options);

    const records = rows
      .map(rowToRecord)
      .filter((post) => options?.includeDrafts || post.published)
      .sort(sortByUpdatedDesc);

    return records.map(toPost);
  } catch (error) {
    console.error("[content] getPosts (DB) failed", error);
    return getPostsFallback(options);
  }
}

export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  const db = getDb();
  if (!db) return getFeaturedPostsFallback(limit);

  const posts = await getPosts();
  return posts.slice(0, limit);
}

export async function getPostBySlug(
  slug: string,
  options?: { includeDrafts?: boolean },
): Promise<Post | undefined> {
  const db = getDb();
  if (!db) return getPostBySlugFallback(slug, options);

  try {
    const rows = await db
      .select({ post: blogPostsTable, cover: mediaAssets })
      .from(blogPostsTable)
      .leftJoin(mediaAssets, eq(blogPostsTable.coverImageAssetId, mediaAssets.id))
      .where(
        options?.includeDrafts
          ? eq(blogPostsTable.slug, slug)
          : and(
              eq(blogPostsTable.slug, slug),
              eq(blogPostsTable.published, true),
            ),
      )
      .limit(1);
    const row = rows[0];
    if (!row) return getPostBySlugFallback(slug, options);

    return toPost(rowToRecord(row));
  } catch (error) {
    console.error("[content] getPostBySlug (DB) failed", error);
    return getPostBySlugFallback(slug, options);
  }
}

export async function getRelatedPosts(slug: string, limit = 3): Promise<Post[]> {
  const db = getDb();
  if (!db) return getRelatedPostsFallback(slug, limit);

  const posts = await getPosts();
  const current = posts.find((post) => post.slug === slug);
  if (!current) return [];

  function score(candidate: Post) {
    let s = 0;
    if (candidate.category === current?.category) s += 3;
    const currentWords = new Set(
      `${current?.title} ${current?.seoQuery}`.toLowerCase().split(/\W+/),
    );
    new Set(
      `${candidate.title} ${candidate.seoQuery}`.toLowerCase().split(/\W+/),
    ).forEach((word) => {
      if (word.length > 2 && currentWords.has(word)) s += 1;
    });
    return s;
  }

  return posts
    .filter((post) => post.slug !== slug)
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit);
}
