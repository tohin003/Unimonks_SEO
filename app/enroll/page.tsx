import type { Metadata } from "next";
import Link from "next/link";

import { LeadForm } from "@/components/lead-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getEnrollContent } from "@/lib/content/enroll";
import { getPrograms } from "@/lib/content/programs";
import { jsonLdString, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book CUET Counseling in Munirka",
  description:
    "Book a counseling session with UNIMONKS in Munirka, New Delhi for CUET preparation, GT, English, domain subjects, and admissions support.",
  alternates: {
    canonical: "/enroll",
  },
  keywords: [
    "Book CUET counseling in Munirka",
    "CUET counseling in New Delhi",
    "UNIMONKS counseling form",
    "CUET admissions support",
  ],
};

const enrollSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "UNIMONKS Counseling Form",
  description:
    "A counseling page for students who want to discuss CUET preparation, batch options, and admissions guidance.",
  url: `${siteConfig.siteUrl}/enroll`,
};

export default async function EnrollPage() {
  const [programs, content] = await Promise.all([
    getPrograms(),
    getEnrollContent(),
  ]);
  const { counselingPoints } = content;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(enrollSchema) }}
      />
      <SiteHeader />
      <main id="main" className="pb-20">
        <section className="section-shell py-14 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_minmax(0,1fr)]">
            <div>
              <span className="eyebrow">{content.hero.eyebrow}</span>
              <h1 className="mt-6 font-headline text-5xl leading-[0.96] text-primary md:text-7xl">
                {content.hero.headline}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                {content.hero.description}
              </p>
              <div className="mt-8 grid gap-4">
                {counselingPoints.map((point) => (
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
              <div className="mt-8 rounded-[28px] bg-[#17233b] p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                  Visit or call
                </p>
                <p className="mt-5 text-lg leading-8">
                  {siteConfig.addressLines[0]}
                  <br />
                  {siteConfig.addressLines[1]}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={siteConfig.phoneHref}
                    className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950"
                  >
                    Call {siteConfig.phoneDisplay}
                  </a>
                  <a
                    href={siteConfig.whatsappHref}
                    className="inline-flex rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
            <LeadForm
              title={content.leadFormCopy.title}
              description={content.leadFormCopy.description}
              submitLabel="Request counseling"
              source="enroll-page"
              tone="dark"
            />
          </div>
        </section>

        <section className="section-shell py-8 md:py-14">
          <div className="grid gap-5 md:grid-cols-3">
            {programs.map((program) => (
              <article key={program.name} className="panel p-6">
                <h2 className="font-headline text-3xl text-primary">
                  {program.name}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {program.summary}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/hub"
              className="inline-flex rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary"
            >
              Explore study resources
            </Link>
            <Link
              href="/blog"
              className="inline-flex rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary"
            >
              Read the blog
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
