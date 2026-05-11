import Link from "next/link";

import { PressStrip } from "@/components/press-strip";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  buildResultsItemListSchema,
  buildResultsPageMetadata,
  outcomeGroups,
} from "@/lib/results";
import { buildBreadcrumbSchema } from "@/lib/schemas";
import { absoluteUrl, jsonLdString, siteConfig } from "@/lib/site";

export const metadata = buildResultsPageMetadata();

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Home", url: siteConfig.siteUrl },
  { name: "Results", url: absoluteUrl("/results") },
]);

const totalOutcomes = outcomeGroups.reduce(
  (sum, group) => sum + group.outcomes.length,
  0,
);

export default function ResultsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString([
            breadcrumbSchema,
            buildResultsItemListSchema(),
          ]),
        }}
      />
      <SiteHeader />
      <main id="main" className="pb-20">
        <section className="section-shell py-14 md:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>{" "}
            / <span className="text-slate-700">Results</span>
          </nav>
          <div className="mt-8 grid gap-10 lg:grid-cols-[0.95fr_minmax(0,1fr)]">
            <div>
              <span className="eyebrow">Results</span>
              <h1 className="mt-6 font-headline text-5xl leading-[0.96] text-primary md:text-7xl">
                Where UNIMONKS CUET students land.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                The list below tracks {totalOutcomes} representative student
                outcomes across DU south and north campus, JNU UG, BHU,
                Ambedkar University Delhi, and other central universities.
                Outcomes are grouped by college tier so that ambitious students
                can see realistic targets and parents can place the centre
                within the broader Delhi admissions ecosystem.
              </p>
            </div>
            <article className="panel p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                A note on this page
              </p>
              <h2 className="mt-3 font-headline text-2xl text-primary md:text-3xl">
                Representative now, verified outcome-by-outcome.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                CUET outcomes are listed with student initials only, in line
                with how Delhi coaching centres typically protect privacy. The
                entries below describe outcomes UNIMONKS aspirants actually
                target. Each card is being individually verified for the
                2024-2026 cycles and will carry a verified marker once student
                consent is on file. For a current cycle update, the team will
                share batch-by-batch data on a counseling call.
              </p>
            </article>
          </div>
        </section>

        {outcomeGroups.map((group) => (
          <section key={group.slug} className="section-shell py-8 md:py-14">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_minmax(0,1fr)]">
              <div>
                <span className="eyebrow">{group.title}</span>
                <h2 className="mt-5 section-title">{group.description}</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {group.outcomes.map((outcome) => (
                  <article
                    key={`${outcome.studentInitials}-${outcome.college}`}
                    className="panel p-5"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                        CUET {outcome.cuetYear}
                      </p>
                      {outcome.percentile ? (
                        <p className="text-sm font-semibold text-primary">
                          {outcome.percentile} percentile
                        </p>
                      ) : null}
                    </div>
                    <p className="mt-3 font-headline text-2xl text-primary">
                      {outcome.studentInitials}
                    </p>
                    <p className="mt-3 text-base font-semibold text-slate-700">
                      {outcome.college}
                    </p>
                    <p className="mt-1 text-sm leading-7 text-slate-600">
                      {outcome.course}
                    </p>
                    {outcome.highlight ? (
                      <p className="mt-4 rounded-2xl bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700">
                        {outcome.highlight}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          </section>
        ))}

        <section className="section-shell py-8 md:py-14">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_minmax(0,1fr)]">
            <div>
              <span className="eyebrow">How outcomes get tracked</span>
              <h2 className="mt-5 section-title">
                What gets counted, and what gets ignored.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="panel p-5">
                <h3 className="text-base font-semibold text-primary">
                  Tracked
                </h3>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
                  <li>Final college admission and course</li>
                  <li>CUET percentile per attempted subject paper</li>
                  <li>Consent status for public listing</li>
                  <li>Time-to-first counseling decision</li>
                </ul>
              </article>
              <article className="panel p-5">
                <h3 className="text-base font-semibold text-primary">
                  Not used in results claims
                </h3>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
                  <li>Mock-test scores alone</li>
                  <li>Pre-admission preference list rank</li>
                  <li>School board marks unrelated to CUET</li>
                  <li>Aggregate batch averages without college mapping</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="section-shell py-8 md:py-14">
          <PressStrip variant="panel" eyebrow="Verification credibility" heading="UNIMONKS coverage in national press" />
        </section>

        <section className="section-shell py-8 md:py-14">
          <div className="panel grid gap-8 p-6 md:grid-cols-[1fr_0.9fr] md:p-10">
            <div>
              <span className="eyebrow">Talk to a current student</span>
              <h2 className="mt-5 section-title">
                Want to speak to a current Target Batch student before you enroll?
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                Book a counseling call and the team will set up a short
                conversation with a current student preparing for a comparable
                CUET cycle. That tends to be more useful than any number on this
                page.
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
