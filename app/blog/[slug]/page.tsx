import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PostCard } from "@/components/post-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPostBySlug, getPosts, getRelatedPosts } from "@/lib/posts";
import { absoluteUrl, jsonLdString, siteConfig } from "@/lib/site";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const posts = await getPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    keywords: [post.seoQuery, post.category, "UNIMONKS blog"],
    openGraph: {
      title: post.title,
      description: post.description,
      url: absoluteUrl(`/blog/${post.slug}`),
      type: "article",
      publishedTime: post.date,
      section: post.category,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.slug);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    articleSection: post.category,
    keywords: [post.seoQuery, post.category],
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/unimonks-logo.png"),
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(articleSchema) }}
      />
      <SiteHeader />
      <main id="main" className="pb-20">
        <section className="section-shell py-14 md:py-18">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>{" "}
            /{" "}
            <Link href="/blog" className="hover:text-primary">
              Blog
            </Link>{" "}
            / <span className="text-slate-700">{post.title}</span>
          </nav>
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <article className="panel p-7 md:p-12">
              <span className="eyebrow">{post.category}</span>
              <h1 className="mt-6 font-headline text-4xl leading-[1.02] text-primary md:text-6xl">
                {post.title}
              </h1>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500">
                <span>{new Date(post.date).toLocaleDateString("en-IN")}</span>
                <span>{post.readingTime}</span>
                <span>{post.seoQuery}</span>
              </div>
              <div className="mt-8 rounded-[28px] bg-[#eef4ff] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Quick answer
                </p>
                <p className="mt-4 text-lg leading-8 text-slate-700">
                  {post.quickAnswer}
                </p>
              </div>
              {post.takeaways.length ? (
                <div className="mt-8 grid gap-3 md:grid-cols-3">
                  {post.takeaways.map((takeaway) => (
                    <div
                      key={takeaway}
                      className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700"
                    >
                      {takeaway}
                    </div>
                  ))}
                </div>
              ) : null}
              <div className="article-prose mt-12">
                {post.sections.map((section) => (
                  <section key={section.heading}>
                    <h2>{section.heading}</h2>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {section.bullets ? (
                      <ul>
                        {section.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                ))}
              </div>
            </article>
            <aside className="space-y-6 self-start lg:sticky lg:top-24">
              <div className="panel p-6">
                <span className="eyebrow">Need Personal Guidance?</span>
                <h2 className="mt-5 font-headline text-3xl leading-tight text-primary">
                  Ready to turn this advice into a study plan?
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Book a counseling call if you want help with batch selection,
                  GT and English planning, domain preparation, or admissions.
                </p>
                <Link
                  href="/enroll#lead-form"
                  aria-label={`Book a counseling call after reading ${post.title}`}
                  className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition-transform hover:-translate-y-0.5"
                >
                  Book counseling
                </Link>
              </div>
              {relatedPosts.length ? (
                <div className="panel p-6">
                  <span className="eyebrow">Related Reading</span>
                  <div className="mt-5 space-y-5">
                    {relatedPosts.map((relatedPost) => (
                      <div key={relatedPost.slug}>
                        <Link
                          href={`/blog/${relatedPost.slug}`}
                          className="text-lg font-semibold leading-7 text-primary hover:text-slate-700"
                        >
                          {relatedPost.title}
                        </Link>
                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </aside>
          </div>
        </section>

        {relatedPosts.length ? (
          <section className="section-shell py-8 md:py-14">
            <div>
              <span className="eyebrow">More To Read</span>
              <h2 className="mt-5 section-title">
                Continue with the next useful topic.
              </h2>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <PostCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
