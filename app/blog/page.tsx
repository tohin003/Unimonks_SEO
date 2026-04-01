import type { Metadata } from "next";

import { LeadForm } from "@/components/lead-form";
import { PostCard } from "@/components/post-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPosts } from "@/lib/posts";
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

export default async function BlogIndexPage() {
  const posts = await getPosts();
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
            </div>
            <LeadForm
              title="Need personal guidance after reading?"
              description="Share your details and the UNIMONKS team will help you choose the right batch, build a study plan, or discuss your admissions questions."
              submitLabel="Request a counseling call"
              source="blog-index"
            />
          </div>
        </section>

        <section className="section-shell py-6 md:py-10">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
