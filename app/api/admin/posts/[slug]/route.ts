import { NextRequest, NextResponse } from "next/server";

import { isAdminRequestAuthorized } from "@/lib/admin";
import { deletePost, getPosts, savePost } from "@/lib/posts";
import { revalidateContentPages } from "@/lib/revalidate-content";

export const runtime = "nodejs";

function unauthorizedResponse() {
  return NextResponse.json(
    { message: "You are not authorized to access the admin dashboard." },
    { status: 401 },
  );
}

export async function PUT(
  request: NextRequest,
  context: RouteContext<"/api/admin/posts/[slug]">,
) {
  if (!isAdminRequestAuthorized(request)) {
    return unauthorizedResponse();
  }

  const { slug } = await context.params;
  const body = await request.json().catch(() => null);

  try {
    const post = await savePost(body, slug);
    const posts = await getPosts({ includeDrafts: true });

    revalidateContentPages(post.slug, slug);

    return NextResponse.json({ post, posts });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "The post could not be saved.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext<"/api/admin/posts/[slug]">,
) {
  if (!isAdminRequestAuthorized(request)) {
    return unauthorizedResponse();
  }

  const { slug } = await context.params;
  const deleted = await deletePost(slug);

  if (!deleted) {
    return NextResponse.json(
      { message: "The selected post no longer exists." },
      { status: 404 },
    );
  }

  const posts = await getPosts({ includeDrafts: true });

  revalidateContentPages(undefined, slug);

  return NextResponse.json({ posts });
}
