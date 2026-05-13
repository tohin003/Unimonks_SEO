import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { LocationInput } from "@/app/admin/_actions/locations";
import { getLocationBySlug } from "@/lib/content/locations";
import { getLocationSlugs } from "@/lib/locations";
import { isDbConfigured } from "@/lib/db/client";

import { LocationEditor } from "./location-editor";

type LocationAdminPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getLocationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: LocationAdminPageProps,
): Promise<Metadata> {
  const { slug } = await props.params;
  const location = await getLocationBySlug(slug);
  return { title: location ? `Location · ${location.area}` : "Location" };
}

export default async function AdminLocationEditorPage(
  props: LocationAdminPageProps,
) {
  const { slug } = await props.params;
  const location = await getLocationBySlug(slug);
  if (!location) notFound();

  const initial: LocationInput = {
    slug: location.slug,
    area: location.area,
    fullName: location.fullName,
    searchQuery: location.searchQuery,
    metaTitle: location.metaTitle,
    metaDescription: location.metaDescription,
    heroEyebrow: location.heroEyebrow,
    heroHeadline: location.heroHeadline,
    intro: location.intro,
    commuteHeading: location.commuteHeading,
    commuteParagraphs: [...location.commuteParagraphs],
    metroNote: location.metroNote,
    driveNote: location.driveNote,
    landmarks: [...location.landmarks],
    schools: [...location.schools],
    whyHere: location.whyHere,
    proofPoints: location.proofPoints.map((p) => ({
      title: p.title,
      body: p.body,
    })),
    localFaqs: location.localFaqs.map((f) => ({
      question: f.question,
      answer: f.answer,
    })),
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="eyebrow">Locations · {location.area}</span>
          <h1 className="mt-5 font-headline text-4xl leading-tight text-primary md:text-5xl">
            Edit the {location.area} location page.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            Saving revalidates /cuet-coaching-in-{location.slug} within a few
            seconds.
          </p>
        </div>
        <a
          href={`/cuet-coaching-in-${location.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary"
        >
          Open live page
        </a>
      </header>

      <LocationEditor
        originalSlug={location.slug}
        initial={initial}
        dbConfigured={isDbConfigured()}
      />
    </div>
  );
}
