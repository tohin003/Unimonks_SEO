import type { Metadata } from "next";

import { LeadForm } from "@/components/lead-form";
import { PostCard } from "@/components/post-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPosts } from "@/lib/content/blog";
import type { Post } from "@/lib/posts";
import { absoluteUrl, jsonLdString, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "CUET Blog",
  description:
    "Read the UNIMONKS blog for practical articles on CUET coaching in Munirka, GT preparation, English improvement, domain subjects, and DU admissions guidance.",
  alternates: {
    canonical: "/blog",
  },
  keywords: [
    "CUET blog",
    "CUET coaching in Munirka",
    "DU admission guidance",
    "CUET General Test strategy",
    "English language preparation for CUET",
  ],
};

function groupPostsByCategory(posts: Post[]) {
  const groups = new Map<string, Post[]>();
  for (const post of posts) {
    const existing = groups.get(post.category) ?? [];
    existing.push(post);
    groups.set(post.category, existing);
  }
  return Array.from(groups.entries()).map(([category, items]) => ({
    category,
    slug: category
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, ""),
    posts: items,
  }));
}

export default async function BlogIndexPage() {
  const posts = await getPosts();
  const grouped = groupPostsByCategory(posts);
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${siteConfig.name} Blog`,
    description:
      "Student-friendly articles on CUET preparation, admissions, and local coaching guidance in Munirka.",
    url: absoluteUrl("/blog"),
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.updatedAt ?? post.date,
      url: absoluteUrl(`/blog/${post.slug}`),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(blogSchema) }}
      />
      <SiteHeader />
      <main id="main" className="pb-20">
        <section className="section-shell py-14 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_minmax(0,1fr)]">
            <div>
              <span className="eyebrow">UNIMONKS Blog</span>
              <h1 className="mt-6 font-headline text-5xl leading-[0.96] text-primary md:text-7xl">
                Practical CUET articles for students who want clear next steps.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Every post is written to answer a real student question around
                CUET coaching in Munirka, DU admissions, GT preparation,
                English improvement, and domain revision.
              </p>
              {grouped.length > 1 ? (
                <nav aria-label="Topics" className="mt-8 flex flex-wrap gap-2">
                  {grouped.map((group) => (
                    <a
                      key={group.slug}
                      href={`#${group.slug}`}
                      className="rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 transition-colors hover:border-primary hover:text-primary"
                    >
                      {group.category}
                    </a>
                  ))}
                </nav>
              ) : null}
            </div>
            <LeadForm
              title="Need personal guidance after reading?"
              description="Share your details and the UNIMONKS team will help you choose the right batch, build a study plan, or discuss your admissions questions."
              submitLabel="Request a counseling call"
              source="blog-index"
            />
          </div>
        </section>

        {grouped.map((group) => (
          <section
            key={group.slug}
            id={group.slug}
            className="section-shell py-8 md:py-12"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="eyebrow">Topic cluster</span>
                <h2 className="mt-3 font-headline text-3xl leading-tight text-primary md:text-4xl">
                  {group.category}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                  {group.posts.length} article{group.posts.length === 1 ? "" : "s"} on{" "}
                  {group.category.toLowerCase()} written for UNIMONKS CUET aspirants.
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {group.posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        ))}
      </main>
      <SiteFooter />
    </>
  );
}
