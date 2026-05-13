import Image from "next/image";
import Link from "next/link";

import type { Post } from "@/lib/posts";

type PostCardProps = {
  post: Post;
  featured?: boolean;
};

export function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex h-full flex-col rounded-[28px] border border-slate-200/80 bg-white/80 p-7 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.35)] transition-transform hover:-translate-y-1 ${
        featured ? "md:p-9" : ""
      }`}
    >
      {post.coverImage ? (
        <div className="-mx-2 mb-5 overflow-hidden rounded-[20px] bg-slate-100">
          <div className="relative aspect-[21/9]">
            <Image
              src={post.coverImage.publicUrl}
              alt={post.coverImage.alt || post.title}
              width={post.coverImage.width}
              height={post.coverImage.height}
              sizes={featured ? "(max-width: 1024px) 92vw, 720px" : "(max-width: 1024px) 92vw, 360px"}
              className="h-full w-full object-cover transition duration-500 group-hover:saturate-110"
            />
          </div>
        </div>
      ) : null}
      <div className="mb-5 flex items-center justify-between gap-4">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600">
          {post.category}
        </span>
        <span className="text-sm text-slate-500">{post.readingTime}</span>
      </div>
      <h3
        className={`font-headline leading-tight text-primary ${
          featured ? "text-4xl" : "text-2xl"
        }`}
      >
        {post.title}
      </h3>
      <p className="mt-4 text-sm leading-7 text-slate-600">{post.excerpt}</p>
      <div className="mt-6 rounded-3xl bg-[#eef4ff] px-4 py-3 text-sm leading-6 text-slate-700">
        <strong className="text-primary">Quick answer:</strong> {post.quickAnswer}
      </div>
      <div className="mt-auto pt-8 text-sm font-semibold text-primary">
        Read article
      </div>
    </Link>
  );
}
