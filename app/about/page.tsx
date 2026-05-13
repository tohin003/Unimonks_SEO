import type { Metadata } from "next";
import Link from "next/link";

import { PressStrip } from "@/components/press-strip";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAboutContent } from "@/lib/content/about";
import { getFeaturedFaculty } from "@/lib/content/faculty";
import { buildBreadcrumbSchema, ORG_ID } from "@/lib/schemas";
import { absoluteUrl, jsonLdString, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About UNIMONKS — CUET coaching in Munirka, New Delhi",
  description:
    "UNIMONKS was founded in 2022 by Dr Arvind Rao in Munirka, New Delhi, to give CUET aspirants a single coordinated programme covering GT, English, domain subjects, and DU admissions.",
  alternates: { canonical: "/about" },
  keywords: [
    "About UNIMONKS",
    "UNIMONKS founder",
    "Dr Arvind Rao",
    "CUET coaching institute Munirka",
    "UNIMONKS story",
  ],
  openGraph: {
    title: "About UNIMONKS — CUET coaching in Munirka",
    description:
      "Founded in 2022 in Munirka, UNIMONKS combines GT, English, domain, and admissions coverage into one coordinated CUET programme.",
    url: absoluteUrl("/about"),
    type: "website",
  },
};

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Home", url: siteConfig.siteUrl },
  { name: "About", url: absoluteUrl("/about") },
]);

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About UNIMONKS",
  url: absoluteUrl("/about"),
  mainEntity: { "@id": ORG_ID },
};

export default async function AboutPage() {
  const [featuredFaculty, content] = await Promise.all([
    getFeaturedFaculty(),
    getAboutContent(),
  ]);
  const founder =
    featuredFaculty.find((member) => member.slug === "arvind-rao") ??
    featuredFaculty[0];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString([breadcrumbSchema, aboutPageSchema]),
        }}
      />
      <SiteHeader />
      <main id="main" className="pb-20">
        <section className="section-shell py-14 md:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>{" "}
            / <span className="text-slate-700">About</span>
          </nav>
          <div className="mt-8 grid gap-10 lg:grid-cols-[0.95fr_minmax(0,1fr)]">
            <div>
              <span className="eyebrow">{content.hero.eyebrow}</span>
              <h1 className="mt-6 font-headline text-5xl leading-[0.96] text-primary md:text-7xl">
                {content.hero.headline}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                {content.hero.description}
              </p>
            </div>
            <div className="grid gap-3">
              <article className="panel p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {content.foundedPanel.eyebrow}
                </p>
                <p className="mt-3 font-headline text-3xl text-primary">
                  {siteConfig.foundingDate}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {content.foundedPanel.description}
                </p>
              </article>
              <article className="panel p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {content.whatWeRunPanel.eyebrow}
                </p>
                <p className="mt-3 font-headline text-3xl text-primary">
                  {content.whatWeRunPanel.title}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {content.whatWeRunPanel.description}
                </p>
              </article>
            </div>
          </div>
        </section>

        {founder ? (
          <section className="section-shell py-8 md:py-14">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_minmax(0,1fr)]">
              <div>
                <span className="eyebrow">{content.founderIntro.eyebrow}</span>
                <h2 className="mt-5 section-title">
                  {content.founderIntro.headline}
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-600">
                  {content.founderIntro.description}
                </p>
              </div>
              <article className="panel p-6 md:p-8" id="founder">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {founder.role}
                </p>
                <h3 className="mt-3 font-headline text-3xl text-primary md:text-4xl">
                  {founder.honorific} {founder.name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {founder.qualifications.join(" · ")} ·{" "}
                  {founder.alma.join(", ")}
                </p>
                <p className="mt-5 text-base leading-8 text-slate-700">
                  {founder.bio}
                </p>
                <div className="mt-6">
                  <Link
                    href="/faculty"
                    className="inline-flex rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary"
                  >
                    Meet the faculty
                  </Link>
                </div>
              </article>
            </div>
          </section>
        ) : null}

        <section className="section-shell py-8 md:py-14">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_minmax(0,1fr)]">
            <div>
              <span className="eyebrow">What guides the centre</span>
              <h2 className="mt-5 section-title">
                Three commitments the team keeps to itself.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                Coaching choices that look small from the outside are usually
                what decides whether a six-month preparation plan actually
                works for a student.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {content.commitments.map((commitment) => (
                <article key={commitment.eyebrow} className="panel p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    {commitment.eyebrow}
                  </p>
                  <p className="mt-3 text-lg font-semibold text-primary">
                    {commitment.title}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {commitment.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell py-8 md:py-14">
          <PressStrip variant="panel" />
        </section>

        <section className="section-shell py-8 md:py-14">
          <div className="panel grid gap-8 p-6 md:grid-cols-[1fr_0.9fr] md:p-10">
            <div>
              <span className="eyebrow">{content.visitIntro.eyebrow}</span>
              <h2 className="mt-5 section-title">
                {content.visitIntro.headline}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                {content.visitIntro.description}
              </p>
            </div>
            <address className="not-italic rounded-[24px] bg-[#17233b] p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                UNIMONKS Munirka
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
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/enroll#lead-form"
                  className="inline-flex rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-950"
                >
                  Book counseling
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
