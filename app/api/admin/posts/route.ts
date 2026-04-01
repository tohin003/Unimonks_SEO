import { NextRequest, NextResponse } from "next/server";

import { isAdminRequestAuthorized } from "@/lib/admin";
import { getPosts, savePost } from "@/lib/posts";
import { revalidateContentPages } from "@/lib/revalidate-content";

export const runtime = "nodejs";

function unauthorizedResponse() {
  return NextResponse.json(
    { message: "You are not authorized to access the admin dashboard." },
    { status: 401 },
  );
}

export async function GET(request: NextRequest) {
  if (!isAdminRequestAuthorized(request)) {
    return unauthorizedResponse();
  }

  const posts = await getPosts({ includeDrafts: true });

  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  if (!isAdminRequestAuthorized(request)) {
    return unauthorizedResponse();
  }

  const body = await request.json().catch(() => null);

  try {
    const post = await savePost(body);
    const posts = await getPosts({ includeDrafts: true });

    revalidateContentPages(post.slug);

    return NextResponse.json({ post, posts }, { status: 201 });
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
