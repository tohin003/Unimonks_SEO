import type { Metadata } from "next";
import Link from "next/link";

import { HeroHeadline } from "@/components/hero-headline";
import { LandingPageAmbient } from "@/components/landing-page-ambient";
import { LeadForm } from "@/components/lead-form";
import { PostCard } from "@/components/post-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getFeaturedPosts } from "@/lib/posts";
import {
  faqItems,
  jsonLdString,
  knowledgeTracks,
  programs,
  siteConfig,
} from "@/lib/site";

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

const homeSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "UNIMONKS Courses",
    itemListElement: programs.map((program, index) => ({
      "@type": "Course",
      position: index + 1,
      name: program.name,
      description: program.summary,
      provider: {
        "@type": "EducationalOrganization",
        name: siteConfig.name,
        url: siteConfig.siteUrl,
      },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  },
];

const supportSteps = [
  {
    title: "Plan your preparation",
    body: "Understand how GT, English, and domain subjects fit into one realistic weekly routine instead of scattered study.",
  },
  {
    title: "Read practical guidance",
    body: "Use the articles and resources to compare coaching options, improve revision, and prepare for DU admissions.",
  },
  {
    title: "Speak to the team",
    body: "Book counseling when you want batch guidance, local support in Munirka, or help after the exam.",
  },
];

const proofPoints = [
  {
    title: "Local support in Munirka",
    body: "Students and parents get a nearby center for counseling, follow-ups, and face-to-face guidance instead of a distant online-only setup.",
  },
  {
    title: "Practical CUET preparation",
    body: "Classes and content stay focused on GT, English, domain subjects, mock review, and a study plan students can actually sustain.",
  },
  {
    title: "Admissions guidance after the exam",
    body: "Support continues into college choices, document planning, and next-step decisions instead of stopping at test day.",
  },
];

export default async function HomePage() {
  const featuredPosts = await getFeaturedPosts();
  const primaryPost = featuredPosts[0];
  const secondaryPosts = featuredPosts.slice(1);

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
                  UNIMONKS curates GT, English, domain classes, mock review,
                  and admissions support into one calm, high-trust preparation
                  journey in Munirka, New Delhi.
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
                title="Talk to the UNIMONKS team"
                description="Share your details and the team will help you choose the right batch, discuss your subject needs, and guide you on the next step."
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
            className="landing-book-dock landing-book-dock-courses"
            data-book-dock
            data-book-open="56"
            data-book-scale="1.05"
            data-book-yaw="22"
            data-book-pitch="15"
            data-book-roll="2"
            data-book-lift="4"
          />
          <div className="grid gap-10 lg:grid-cols-[0.85fr_minmax(0,1fr)]">
            <div>
              <span className="eyebrow">Courses</span>
              <h2 className="mt-5 section-title">
                Coaching plans built around real CUET needs.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                Strong preparation is not only about content quantity. Students
                usually need GT, English, domain support, mock feedback, and
                admission clarity working together.
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
                <span className="eyebrow">How Students Use The Site</span>
                <h2 className="mt-5 section-title">
                  Learn first, then take the next step with confidence.
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-600">
                  This website is designed to be useful before it asks for a
                  form submission. Students can understand the exam, read
                  practical articles, and then ask for personal guidance when
                  they are ready.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {supportSteps.map((step) => (
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
              <span className="eyebrow">Latest Articles</span>
              <h2 className="mt-5 section-title">
                CUET articles, strategy notes, and admission guidance.
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

        <section id="faq" className="section-shell relative py-8 md:py-14">
          <span
            aria-hidden="true"
            className="landing-book-dock landing-book-dock-faq"
            data-book-dock
            data-book-open="92"
            data-book-scale="0.92"
            data-book-yaw="12"
            data-book-pitch="14"
            data-book-roll="6"
            data-book-lift="8"
          />
          <div className="grid gap-10 lg:grid-cols-[0.8fr_minmax(0,1fr)]">
            <div>
              <span className="eyebrow">FAQs</span>
              <h2 className="mt-5 section-title">
                Answers students and parents usually need first.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                Clear headings, useful answers, and strong internal links help
                both search engines and students understand what the business
                actually offers.
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
            data-book-open="66"
            data-book-scale="0.9"
            data-book-yaw="18"
            data-book-pitch="12"
            data-book-roll="8"
            data-book-lift="4"
          />
          <div className="panel grid gap-8 p-6 md:grid-cols-[1fr_0.9fr] md:p-10">
            <div>
              <span className="eyebrow">Visit UNIMONKS In Munirka</span>
              <h2 className="mt-5 section-title">
                Local trust matters when preparation needs consistency.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                The Munirka center gives students and parents a real place to
                ask questions, review progress, discuss batches, and stay close
                to the counseling process.
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
