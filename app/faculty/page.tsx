import Link from "next/link";

import { PressStrip } from "@/components/press-strip";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  buildFacultyPageMetadata,
  buildFacultyPersonSchemas,
  facultyClusters,
  featuredFaculty,
} from "@/lib/faculty";
import { buildBreadcrumbSchema } from "@/lib/schemas";
import { jsonLdString, siteConfig } from "@/lib/site";

export const metadata = buildFacultyPageMetadata();

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Home", url: siteConfig.siteUrl },
  { name: "Faculty", url: `${siteConfig.siteUrl}/faculty` },
]);

export default function FacultyPage() {
  const schemas = [breadcrumbSchema, ...buildFacultyPersonSchemas()];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(schemas) }}
      />
      <SiteHeader />
      <main id="main" className="pb-20">
        <section className="section-shell py-14 md:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>{" "}
            / <span className="text-slate-700">Faculty</span>
          </nav>
          <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_minmax(0,1fr)]">
            <div>
              <span className="eyebrow">Faculty</span>
              <h1 className="mt-6 font-headline text-5xl leading-[0.96] text-primary md:text-7xl">
                The teachers who actually run the room.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                UNIMONKS runs CUET coaching with 18+ faculty from Jawaharlal
                Nehru University, IIT Delhi, and Delhi University, including
                PhD-qualified academics. The roster covers GT, English,
                Psychology, Commerce, Humanities, and a dedicated admissions
                desk that handles DU, JNU, BHU, and central university
                counseling.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <article className="panel p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Affiliations
                </p>
                <p className="mt-3 text-base font-semibold text-primary">
                  JNU · IIT Delhi · Delhi University
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Faculty backgrounds drawn from India&apos;s top research and
                  teaching universities.
                </p>
              </article>
              <article className="panel p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Coverage
                </p>
                <p className="mt-3 text-base font-semibold text-primary">
                  GT · English · Domain · Admissions
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Every CUET paper plus end-to-end admissions support.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="section-shell py-8 md:py-14">
          <div>
            <span className="eyebrow">Founder & Academic Director</span>
            <h2 className="mt-5 section-title">Who leads the academic vision.</h2>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {featuredFaculty.map((member) => (
              <article
                key={member.slug}
                className="panel p-6 md:p-8"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {member.role}
                </p>
                <h3 className="mt-3 font-headline text-3xl text-primary md:text-4xl">
                  {member.honorific ? `${member.honorific} ${member.name}` : member.name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {member.qualifications.join(" · ")} ·{" "}
                  {member.alma.join(", ")}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  Teaches: {member.subjects.join(", ")}
                </p>
                <p className="mt-5 text-base leading-8 text-slate-700">
                  {member.bio}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell py-8 md:py-14">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_minmax(0,1fr)]">
            <div>
              <span className="eyebrow">Faculty by subject</span>
              <h2 className="mt-5 section-title">
                Who teaches what across the CUET papers.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                Specialists by section so that GT, English, domain papers, and
                admissions get coordinated attention through the year rather
                than one-shot crash sessions. Individual faculty profiles are
                being added; the cluster cards below reflect the current
                verified roster.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {facultyClusters.map((cluster) => (
                <article key={cluster.area} className="panel p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    {cluster.count}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-primary">
                    {cluster.area}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {cluster.description}
                  </p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    From: {cluster.affiliations.join(" · ")}
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
              <span className="eyebrow">Talk to the team</span>
              <h2 className="mt-5 section-title">
                Want the faculty list for your subject before you enroll?
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                Book a counseling call and the team will share the current
                subject-wise faculty roster, batch timings, and which sessions
                each instructor runs in the upcoming cycle.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 md:justify-end">
              <Link
                href="/enroll#lead-form"
                className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition-transform hover:-translate-y-0.5"
              >
                Book a counseling session
              </Link>
              <a
                href={siteConfig.phoneHref}
                className="inline-flex rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary"
              >
                Call {siteConfig.phoneDisplay}
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
