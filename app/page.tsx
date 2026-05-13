import type { Metadata } from "next";
import Link from "next/link";

import { HeroHeadline } from "@/components/hero-headline";
import { LandingPageAmbient } from "@/components/landing-page-ambient";
import { LeadForm } from "@/components/lead-form";
import { PostCard } from "@/components/post-card";
import { PressStrip } from "@/components/press-strip";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getFaqItems } from "@/lib/content/faqs";
import { getHomeContent } from "@/lib/content/home";
import { getKnowledgeTracks } from "@/lib/content/knowledge-tracks";
import { getFeaturedPosts } from "@/lib/content/blog";
import { getPrograms } from "@/lib/content/programs";
import {
  buildBreadcrumbSchema,
  buildCourseListSchema,
  buildFAQSchema,
} from "@/lib/schemas";
import { jsonLdString, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "CUET Coaching in Munirka, New Delhi",
  description:
    "UNIMONKS offers CUET coaching in Munirka, New Delhi with support for GT, English, domain subjects, admissions guidance, and student-friendly counseling.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "CUET coaching in Munirka",
    "CUET coaching in New Delhi",
    "CUET classes in Munirka",
    "DU admission guidance",
    "CUET GT preparation",
  ],
};

function buildHomeSchemas(
  programs: Awaited<ReturnType<typeof getPrograms>>,
  faqs: Awaited<ReturnType<typeof getFaqItems>>,
) {
  return [
    buildBreadcrumbSchema([{ name: "Home", url: siteConfig.siteUrl }]),
    buildCourseListSchema(programs),
    buildFAQSchema(faqs),
  ];
}

export default async function HomePage() {
  const [featuredPosts, programs, knowledgeTracks, faqItems, homeContent] =
    await Promise.all([
      getFeaturedPosts(),
      getPrograms(),
      getKnowledgeTracks(),
      getFaqItems("home"),
      getHomeContent(),
    ]);
  const primaryPost = featuredPosts[0];
  const secondaryPosts = featuredPosts.slice(1);
  const homeSchemas = buildHomeSchemas(programs, faqItems);
  const { proofPoints, supportSteps } = homeContent;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(homeSchemas) }}
      />
      <SiteHeader />
      <main id="main" className="landing-page pb-20">
        <LandingPageAmbient />
        <section className="hero-stage relative overflow-hidden">
          <span
            aria-hidden="true"
            className="landing-book-dock landing-book-dock-hero"
            data-book-dock
            data-book-open="54"
            data-book-scale="0.88"
            data-book-yaw="-18"
            data-book-pitch="15"
            data-book-roll="-6"
            data-book-lift="-18"
          />
          <div aria-hidden="true" className="hero-aura hero-aura-blue" />
          <div aria-hidden="true" className="hero-aura hero-aura-peach" />
          <div aria-hidden="true" className="hero-aura hero-aura-mist" />
          <div aria-hidden="true" className="hero-grid" />
          <div aria-hidden="true" className="hero-orbit hero-orbit-large" />
          <div aria-hidden="true" className="hero-orbit hero-orbit-small" />
          <div className="section-shell relative py-14 md:py-20">
            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
              <div>
                <span className="eyebrow">{siteConfig.heroLabel}</span>
                <HeroHeadline />
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                  {homeContent.heroSubhead}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/enroll#lead-form"
                    className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition-transform hover:-translate-y-0.5"
                  >
                    Book a counseling session
                  </Link>
                  <Link
                    href="/hub"
                    className="inline-flex rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary"
                  >
                    Explore study resources
                  </Link>
                </div>
                <div className="mt-10 grid gap-4 md:grid-cols-3">
                  {proofPoints.map((point) => (
                    <article key={point.title} className="panel p-5">
                      <h2 className="text-lg font-semibold text-primary">
                        {point.title}
                      </h2>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {point.body}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
              <LeadForm
                title={homeContent.leadFormCopy.title}
                description={homeContent.leadFormCopy.description}
                submitLabel="Request a callback"
                source="home-page"
              />
            </div>
          </div>
        </section>

        <section
          id="programs"
          className="section-shell relative py-8 md:py-14"
        >
          <span
            aria-hidden="true"
            className="landing-book-dock landing-book-dock-courses-intro"
            data-book-dock
            data-book-open="52"
            data-book-scale="0.86"
            data-book-yaw="18"
            data-book-pitch="14"
            data-book-roll="0"
            data-book-lift="0"
          />
          <span
            aria-hidden="true"
            className="landing-book-dock landing-book-dock-courses-showcase"
            data-book-dock
            data-book-open="58"
            data-book-scale="1.08"
            data-book-yaw="26"
            data-book-pitch="15"
            data-book-roll="3"
            data-book-lift="2"
          />
          <div className="grid gap-10 lg:grid-cols-[0.85fr_minmax(0,1fr)]">
            <div>
              <span className="eyebrow">{homeContent.programsIntro.eyebrow}</span>
              <h2 className="mt-5 section-title">
                {homeContent.programsIntro.headline}
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                {homeContent.programsIntro.description}
              </p>
            </div>
            <div className="grid gap-5">
              {programs.map((program) => (
                <article key={program.name} className="panel p-6">
                  <div className="grid gap-6 md:grid-cols-[1fr_0.9fr]">
                    <div>
                      <h3 className="font-headline text-3xl text-primary">
                        {program.name}
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-slate-600">
                        {program.summary}
                      </p>
                    </div>
                    <ul className="space-y-3 text-sm leading-7 text-slate-700">
                      {program.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="rounded-2xl bg-slate-50 px-4 py-3"
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell relative py-8 md:py-14">
          <span
            aria-hidden="true"
            className="landing-book-dock landing-book-dock-journey"
            data-book-dock
            data-book-open="104"
            data-book-scale="0.93"
            data-book-yaw="10"
            data-book-pitch="18"
            data-book-roll="5"
            data-book-lift="-10"
          />
          <div className="panel overflow-hidden p-6 md:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_minmax(0,1fr)]">
              <div>
                <span className="eyebrow">{supportSteps.eyebrow}</span>
                <h2 className="mt-5 section-title">
                  {supportSteps.headline}
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-600">
                  {supportSteps.description}
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {supportSteps.items.map((step) => (
                  <article
                    key={step.title}
                    className="rounded-[24px] border border-slate-200 bg-white p-5"
                  >
                    <h3 className="text-xl font-semibold text-primary">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {step.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell relative py-8 md:py-14">
          <span
            aria-hidden="true"
            className="landing-book-dock landing-book-dock-articles"
            data-book-dock
            data-book-open="122"
            data-book-scale="0.9"
            data-book-yaw="-10"
            data-book-pitch="16"
            data-book-roll="-5"
            data-book-lift="-16"
          />
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="eyebrow">{homeContent.articlesIntro.eyebrow}</span>
              <h2 className="mt-5 section-title">
                {homeContent.articlesIntro.headline}
              </h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary"
            >
              Open the full blog
            </Link>
          </div>
          {primaryPost ? (
            <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr_0.9fr]">
              <PostCard post={primaryPost} featured />
              {secondaryPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : null}
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {knowledgeTracks.map((track) => (
              <article
                key={track.title}
                className="rounded-[24px] border border-slate-200/80 bg-white/70 p-5"
              >
                <h3 className="text-base font-semibold text-primary">
                  {track.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {track.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell py-8 md:py-14">
          <PressStrip />
        </section>

        <section id="faq" className="section-shell relative py-8 md:py-14">
          <span
            aria-hidden="true"
            className="landing-book-dock landing-book-dock-faq-intro"
            data-book-dock
            data-book-open="78"
            data-book-scale="0.82"
            data-book-yaw="16"
            data-book-pitch="15"
            data-book-roll="6"
            data-book-lift="4"
          />
          <span
            aria-hidden="true"
            className="landing-book-dock landing-book-dock-faq-showcase"
            data-book-dock
            data-book-open="54"
            data-book-scale="1.16"
            data-book-yaw="28"
            data-book-pitch="14"
            data-book-roll="4"
            data-book-lift="-4"
          />
          <div className="grid gap-10 lg:grid-cols-[0.8fr_minmax(0,1fr)]">
            <div>
              <span className="eyebrow">{homeContent.faqIntro.eyebrow}</span>
              <h2 className="mt-5 section-title">
                {homeContent.faqIntro.headline}
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                {homeContent.faqIntro.description}
              </p>
            </div>
            <div className="space-y-4">
              {faqItems.map((faq) => (
                <article key={faq.question} className="panel p-6">
                  <h3 className="text-xl font-semibold text-primary">
                    {faq.question}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {faq.answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell relative py-8 md:py-14">
          <span
            aria-hidden="true"
            className="landing-book-dock landing-book-dock-contact"
            data-book-dock
            data-book-open="42"
            data-book-scale="0.96"
            data-book-yaw="-24"
            data-book-pitch="16"
            data-book-roll="-8"
            data-book-lift="-6"
          />
          <span
            aria-hidden="true"
            className="landing-book-dock landing-book-dock-outro"
            data-book-dock
            data-book-open="18"
            data-book-scale="0.68"
            data-book-yaw="-46"
            data-book-pitch="10"
            data-book-roll="-14"
            data-book-lift="16"
          />
          <div className="panel grid gap-8 p-6 md:grid-cols-[1fr_0.9fr] md:p-10">
            <div>
              <span className="eyebrow">{homeContent.contactIntro.eyebrow}</span>
              <h2 className="mt-5 section-title">
                {homeContent.contactIntro.headline}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                {homeContent.contactIntro.description}
              </p>
            </div>
            <address className="not-italic rounded-[24px] bg-[#17233b] p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                Contact the team
              </p>
              <p className="mt-5 text-lg leading-8">
                {siteConfig.addressLines[0]}
                <br />
                {siteConfig.addressLines[1]}
              </p>
              <p className="mt-5">
                <a href={siteConfig.phoneHref} className="text-white">
                  {siteConfig.phoneDisplay}
                </a>
              </p>
              <p className="mt-2">
                <a href={`mailto:${siteConfig.email}`} className="text-white">
                  {siteConfig.email}
                </a>
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/enroll#lead-form"
                  className="inline-flex rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-950"
                >
                  Get free counseling
                </Link>
                <a
                  href={siteConfig.whatsappHref}
                  className="inline-flex rounded-full border border-white/20 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Open WhatsApp
                </a>
              </div>
            </address>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
