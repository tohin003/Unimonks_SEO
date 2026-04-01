import type { Metadata } from "next";

import { LeadForm } from "@/components/lead-form";
import { PostCard } from "@/components/post-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getFeaturedPosts, getPosts } from "@/lib/posts";
import { jsonLdString, knowledgeTracks, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Knowledge Hub",
  description:
    "Browse UNIMONKS study resources on CUET coaching in Munirka, GT preparation, English, Psychology, DU admissions, and other student questions.",
  alternates: {
    canonical: "/hub",
  },
  keywords: [
    "CUET knowledge hub",
    "CUET blog",
    "DU admissions blog",
    "CUET English strategy",
    "CUET GT articles",
  ],
};

export default async function KnowledgeHubPage() {
  const posts = await getPosts();
  const featuredPosts = await getFeaturedPosts();
  const leadPost = featuredPosts[0];
  const morePosts = posts.filter((post) => post.slug !== leadPost?.slug);
  const hubSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "UNIMONKS Knowledge Hub",
    description:
      "A study resource hub covering CUET coaching in Munirka, GT, English, domain revision, and admissions support.",
    url: `${siteConfig.siteUrl}/hub`,
    hasPart: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url: `${siteConfig.siteUrl}/blog/${post.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(hubSchema) }}
      />
      <SiteHeader />
      <main id="main" className="pb-20">
        <section className="section-shell py-14 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_minmax(0,1fr)]">
            <div>
              <span className="eyebrow">CUET Study Resources</span>
              <h1 className="mt-6 font-headline text-5xl leading-[0.96] text-primary md:text-7xl">
                Articles and topic clusters that help students prepare with more
                clarity.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Use the hub to read about GT, English, domain subjects,
                admissions strategy, and the questions students usually ask
                before choosing CUET coaching in Munirka.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {knowledgeTracks.map((track) => (
                <article key={track.title} className="panel p-5">
                  <h2 className="text-lg font-semibold text-primary">
                    {track.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {track.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell py-4 md:py-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            {leadPost ? <PostCard post={leadPost} featured /> : null}
            <aside className="panel self-start p-6">
              <span className="eyebrow">How To Use This Page</span>
              <h2 className="mt-5 font-headline text-3xl leading-tight text-primary">
                Start with the topic that matches your biggest question.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                If you are confused about coaching, start with local guidance.
                If GT, English, or admissions feels weak, choose that topic and
                keep reading in sequence. The goal is to turn search visits into
                real understanding.
              </p>
            </aside>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {morePosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        <section className="section-shell py-8 md:py-14">
          <div className="grid gap-8 lg:grid-cols-[0.88fr_minmax(0,1fr)]">
            <div className="panel p-6 md:p-8">
              <span className="eyebrow">Need Personal Guidance?</span>
              <h2 className="mt-5 font-headline text-4xl leading-tight text-primary">
                Read first, then ask for the right next step.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                Students usually ask better questions after reading a few
                relevant articles. When you are ready, the counseling form lets
                you take that next step without leaving the website.
              </p>
            </div>
            <LeadForm
              title="Ask for a call from the team"
              description="Share what you need help with and UNIMONKS will guide you on batches, preparation, and admissions support."
              submitLabel="Request a counseling call"
              source="knowledge-hub"
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
