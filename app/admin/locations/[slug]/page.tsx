import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SectionPlaceholder } from "@/app/admin/_components/section-placeholder";
import {
  getLocationBySlug,
  getLocationSlugs,
  locations,
} from "@/lib/locations";

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
  const location = getLocationBySlug(slug);
  return { title: location ? `Location · ${location.area}` : "Location" };
}

export default async function AdminLocationEditor(
  props: LocationAdminPageProps,
) {
  const { slug } = await props.params;
  const location = getLocationBySlug(slug);
  if (!location) notFound();

  return (
    <SectionPlaceholder
      eyebrow={`Locations · ${location.area}`}
      title={`Edit the ${location.area} location page.`}
      description={`Local copy, commute notes, schools, proof points, and FAQs for /cuet-coaching-in-${location.slug}.`}
      livePath={`/cuet-coaching-in-${location.slug}`}
      fields={[
        {
          name: "Slug",
          description: "URL path segment. Changing this redirects the old URL.",
          sample: `/cuet-coaching-in-${location.slug}`,
        },
        {
          name: "Area + full name",
          description: "Short label and full geographic name.",
          sample: `${location.area} · ${location.fullName}`,
        },
        {
          name: "Search query",
          description: "Primary keyword targeted by this page.",
          sample: location.searchQuery,
        },
        {
          name: "Meta title + description",
          description: "SEO surface; controls Google snippet on this URL.",
        },
        {
          name: "Hero eyebrow + headline",
          description: "Top-of-page eyebrow chip + the main H1.",
        },
        {
          name: "Intro paragraph",
          description: "Locality-specific lead paragraph.",
        },
        {
          name: "Hero image",
          description: "Optional 16:9 image for the hero slot.",
        },
        {
          name: "Commute heading + paragraphs",
          description: "Re-orderable list of how-to-reach paragraphs.",
        },
        {
          name: "Metro + drive notes",
          description: "Two short callout cards under commute.",
        },
        {
          name: "Landmarks",
          description: `Re-orderable list (${location.landmarks.length} entries today).`,
        },
        {
          name: "Schools",
          description: `Re-orderable feeder-school list (${location.schools.length} entries today).`,
        },
        {
          name: "Why here",
          description: "Single paragraph framing the catchment.",
        },
        {
          name: "Proof points",
          description: `Re-orderable cards (${location.proofPoints.length} today, each with title + body).`,
        },
        {
          name: "Local FAQs",
          description: `Re-orderable question + answer pairs (${location.localFaqs.length} today).`,
        },
      ]}
    />
  );
}

void locations;
