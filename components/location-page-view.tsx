import Link from "next/link";

import { LeadForm } from "@/components/lead-form";
import { PostCard } from "@/components/post-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getFeaturedPosts } from "@/lib/content/blog";
import { getLocationBySlug } from "@/lib/content/locations";
import { getPrograms } from "@/lib/content/programs";
import { getSiteSettings } from "@/lib/content/site";
import { getOtherLocations, type Location } from "@/lib/locations";
import {
  buildBreadcrumbSchema,
  buildFAQSchema,
  ORG_ID,
} from "@/lib/schemas";
import { absoluteUrl, jsonLdString, type Program } from "@/lib/site";

type LocationPageViewProps = {
  slug: string;
};

export async function LocationPageView({ slug }: LocationPageViewProps) {
  const location = await getLocationBySlug(slug);
  if (!location) {
    throw new Error(`Unknown location slug: ${slug}`);
  }

  const otherLocations = getOtherLocations(location.slug);
  const [featuredPosts, programs, siteConfig] = await Promise.all([
    getFeaturedPosts(),
    getPrograms(),
    getSiteSettings(),
  ]);
  const canonicalUrl = absoluteUrl(`/cuet-coaching-in-${location.slug}`);

  const localServiceSchema = buildLocalServiceSchema(
    location,
    programs,
    siteConfig.name,
  );
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: siteConfig.siteUrl },
    { name: location.area, url: canonicalUrl },
  ]);
  const faqSchema = buildFAQSchema(location.localFaqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString([
            localServiceSchema,
            breadcrumbSchema,
            faqSchema,
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
            / <span className="text-slate-700">{location.area}</span>
          </nav>
          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div>
              <span className="eyebrow">{location.heroEyebrow}</span>
              <h1 className="mt-6 font-headline text-4xl leading-[1.02] text-primary md:text-6xl">
                {location.heroHeadline}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                {location.intro}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
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
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {location.proofPoints.map((point) => (
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
              title={`Counseling for students from ${location.area}`}
              description="Share your details and the UNIMONKS team will get back with batch options, commute notes, and the next step."
              submitLabel="Request a callback"
              source={`location-${location.slug}`}
            />
          </div>
        </section>

        <section className="section-shell py-8 md:py-14">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_minmax(0,1fr)]">
            <div>
              <span className="eyebrow">Commute</span>
              <h2 className="mt-5 section-title">{location.commuteHeading}</h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                {location.whyHere}
              </p>
            </div>
            <div className="space-y-5">
              {location.commuteParagraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-8 text-slate-700"
                >
                  {paragraph}
                </p>
              ))}
              <div className="grid gap-3 md:grid-cols-2">
                <div className="panel p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Metro
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    {location.metroNote}
                  </p>
                </div>
                <div className="panel p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    By road
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    {location.driveNote}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell py-8 md:py-14">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_minmax(0,1fr)]">
            <div>
              <span className="eyebrow">Programs</span>
              <h2 className="mt-5 section-title">
                Coaching plans built around real CUET needs.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                The same Foundation, Target, and Admissions tracks run from the
                Munirka centre — students from {location.area} join the
                standard batches without a separate setup.
              </p>
            </div>
            <div className="grid gap-5">
              {programs.map((program) => (
                <article key={program.name} className="panel p-6">
                  <h3 className="font-headline text-3xl text-primary">
                    {program.name}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {program.summary}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell py-8 md:py-14">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_minmax(0,1fr)]">
            <div>
              <span className="eyebrow">Nearby schools</span>
              <h2 className="mt-5 section-title">
                Common feeder schools near {location.area}.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                These are the schools whose students most often consider the
                UNIMONKS Munirka centre when choosing a CUET coaching setup.
              </p>
            </div>
            <ul className="grid gap-3 md:grid-cols-2">
              {location.schools.map((school) => (
                <li
                  key={school}
                  className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm font-medium leading-6 text-slate-700"
                >
                  {school}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section-shell py-8 md:py-14">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_minmax(0,1fr)]">
            <div>
              <span className="eyebrow">FAQs from {location.area}</span>
              <h2 className="mt-5 section-title">
                Questions students and parents from {location.area} usually ask first.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                Direct answers to the questions that decide whether a centre
                actually fits a student&apos;s weekly schedule.
              </p>
            </div>
            <div className="space-y-4">
              {location.localFaqs.map((faq) => (
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

        <section className="section-shell py-8 md:py-14">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="eyebrow">Also serving</span>
              <h2 className="mt-5 section-title">
                Areas across South Delhi we coach for CUET.
              </h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary"
            >
              Read the CUET blog
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3 xl:grid-cols-5">
            {otherLocations.map((other) => (
              <Link
                key={other.slug}
                href={`/cuet-coaching-in-${other.slug}`}
                className="group rounded-[24px] border border-slate-200/80 bg-white/70 p-5 transition-transform hover:-translate-y-1"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Coaching for
                </p>
                <p className="mt-3 font-headline text-2xl leading-tight text-primary">
                  {other.area}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {other.searchQuery}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {featuredPosts.length ? (
          <section className="section-shell py-8 md:py-14">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="eyebrow">From the blog</span>
                <h2 className="mt-5 section-title">
                  Articles students from {location.area} usually read first.
                </h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary"
              >
                Open the full blog
              </Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {featuredPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="section-shell py-8 md:py-14">
          <div className="panel grid gap-8 p-6 md:grid-cols-[1fr_0.9fr] md:p-10">
            <div>
              <span className="eyebrow">Visit UNIMONKS</span>
              <h2 className="mt-5 section-title">
                Walk in from {location.area} when you want to see the centre.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                The Munirka centre is set up for face-to-face counseling. Drop
                in any working evening or call ahead and the team will hold a
                slot.
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

function buildLocalServiceSchema(
  location: Location,
  programs: Program[],
  organizationName: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: location.metaTitle,
    description: location.metaDescription,
    provider: { "@id": ORG_ID },
    areaServed: {
      "@type": "Place",
      name: location.fullName,
    },
    serviceType: "CUET coaching",
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${organizationName} coaching programmes`,
      itemListElement: programs.map((program, index) => ({
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Course",
          name: program.name,
          description: program.summary,
          provider: { "@id": ORG_ID },
        },
      })),
    },
  };
}
