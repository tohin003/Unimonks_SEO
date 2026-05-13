import type { Metadata } from "next";
import Link from "next/link";

import { PressStrip } from "@/components/press-strip";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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
  const featuredFaculty = await getFeaturedFaculty();
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
              <span className="eyebrow">About UNIMONKS</span>
              <h1 className="mt-6 font-headline text-5xl leading-[0.96] text-primary md:text-7xl">
                A Munirka coaching centre built for the way CUET actually works.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                UNIMONKS was founded in {siteConfig.foundingDate} by Dr Arvind
                Rao to give CUET aspirants in South Delhi one place that treats
                GT, English, domain subjects, and admissions as a single
                coordinated programme. The Munirka centre is the home of that
                work — close to JNU, RK Puram, and Vasant Kunj, with batches
                that respect the weekly rhythm of school students rather than
                stretching them into burnout.
              </p>
            </div>
            <div className="grid gap-3">
              <article className="panel p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Founded
                </p>
                <p className="mt-3 font-headline text-3xl text-primary">
                  {siteConfig.foundingDate}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  In Munirka, New Delhi, with the goal of building a focused
                  CUET preparation system for South Delhi.
                </p>
              </article>
              <article className="panel p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  What we run
                </p>
                <p className="mt-3 font-headline text-3xl text-primary">
                  Foundation · Target · Admissions
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Three tracks that cover the full CUET cycle — preparation,
                  rank-oriented mocks, and DU + JNU admissions guidance.
                </p>
              </article>
            </div>
          </div>
        </section>

        {founder ? (
          <section className="section-shell py-8 md:py-14">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_minmax(0,1fr)]">
              <div>
                <span className="eyebrow">Founder</span>
                <h2 className="mt-5 section-title">
                  The conviction the centre is built on.
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-600">
                  CUET preparation in Delhi was scattered before UNIMONKS — GT,
                  English, and domain papers ran as separate tracks, and
                  admissions support stopped at the exam. The centre was built
                  to fix that gap rather than to add another option.
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
              <article className="panel p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  One programme
                </p>
                <p className="mt-3 text-lg font-semibold text-primary">
                  GT, English, domain, admissions — together.
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  No paper is treated as the optional one. The batch schedule
                  keeps all four threads alive each week so nothing collapses
                  in the final month.
                </p>
              </article>
              <article className="panel p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Mocks reviewed, not just taken
                </p>
                <p className="mt-3 text-lg font-semibold text-primary">
                  Every mock produces a written error log.
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Test counts are easy. Pattern recognition is hard. The centre
                  optimises for the second because that is what moves rank.
                </p>
              </article>
              <article className="panel p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Admissions before, during, after
                </p>
                <p className="mt-3 text-lg font-semibold text-primary">
                  Counseling continues into DU and JNU UG.
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Most institutes stop at exam day. UNIMONKS continues into
                  preference lists, document readiness, and the CSAS portal so
                  the final outcome is not left to last-minute guesswork.
                </p>
              </article>
              <article className="panel p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Local centre, real conversations
                </p>
                <p className="mt-3 text-lg font-semibold text-primary">
                  Parents and students can walk in.
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  The Munirka centre is set up for face-to-face progress
                  meetings. The work is easier to trust when families can see
                  the room their child is studying in.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="section-shell py-8 md:py-14">
          <PressStrip variant="panel" />
        </section>

        <section className="section-shell py-8 md:py-14">
          <div className="panel grid gap-8 p-6 md:grid-cols-[1fr_0.9fr] md:p-10">
            <div>
              <span className="eyebrow">Visit the centre</span>
              <h2 className="mt-5 section-title">
                Walk in to the Munirka centre or book a counseling call.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                The team prefers in-person conversations — they make batch
                fit, subject planning, and admissions strategy easier to talk
                through. Walk in any working evening or book a slot in
                advance.
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
