import type { Metadata } from "next";

import { LeadForm } from "@/components/lead-form";
import { PostCard } from "@/components/post-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getHubContent } from "@/lib/content/hub";
import { getKnowledgeTracks } from "@/lib/content/knowledge-tracks";
import { getFeaturedPosts, getPosts } from "@/lib/content/blog";
import { jsonLdString, siteConfig } from "@/lib/site";

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
  const [posts, featuredPosts, knowledgeTracks, content] = await Promise.all([
    getPosts(),
    getFeaturedPosts(),
    getKnowledgeTracks(),
    getHubContent(),
  ]);
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
              <span className="eyebrow">{content.hero.eyebrow}</span>
              <h1 className="mt-6 font-headline text-5xl leading-[0.96] text-primary md:text-7xl">
                {content.hero.headline}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                {content.hero.description}
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
              <span className="eyebrow">{content.howToUse.eyebrow}</span>
              <h2 className="mt-5 font-headline text-3xl leading-tight text-primary">
                {content.howToUse.headline}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {content.howToUse.description}
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
              title={content.leadFormCopy.title}
              description={content.leadFormCopy.description}
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
