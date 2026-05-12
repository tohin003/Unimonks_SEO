import type { Metadata } from "next";

import { getPosts } from "@/lib/posts";

import { BlogEditor } from "./blog-editor";

export const metadata: Metadata = {
  title: "Blog",
};

export default async function AdminBlogPage() {
  const posts = await getPosts({ includeDrafts: true });

  return (
    <div className="space-y-6">
      <header>
        <span className="eyebrow">Blog</span>
        <h1 className="mt-5 font-headline text-4xl leading-tight text-primary md:text-5xl">
          Draft, publish, and update CUET articles.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          Posts saved here regenerate the public blog and sitemap immediately.
        </p>
      </header>
      <BlogEditor initialPosts={posts} />
    </div>
  );
}
