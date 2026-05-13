import { asc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import {
  locationFaqs as locationFaqsTable,
  locationPages as locationPagesTable,
} from "@/lib/db/schema";
import {
  getLocationBySlug as getLocationFallback,
  locations as locationsFallback,
  type Location,
} from "@/lib/locations";

export async function getLocations(): Promise<Location[]> {
  const db = getDb();
  if (!db) return [...locationsFallback];

  try {
    const rows = await db
      .select()
      .from(locationPagesTable)
      .orderBy(asc(locationPagesTable.position));

    if (rows.length === 0) return [...locationsFallback];

    const faqRows = await db
      .select()
      .from(locationFaqsTable)
      .orderBy(asc(locationFaqsTable.position));

    return rows.map((row) => rowToLocation(row, faqRows));
  } catch (error) {
    console.error("[content] getLocations failed", error);
    return [...locationsFallback];
  }
}

export async function getLocationBySlug(
  slug: string,
): Promise<Location | undefined> {
  const db = getDb();
  if (!db) return getLocationFallback(slug);

  try {
    const rows = await db
      .select()
      .from(locationPagesTable)
      .where(eq(locationPagesTable.slug, slug))
      .limit(1);

    const row = rows[0];
    if (!row) return getLocationFallback(slug);

    const faqRows = await db
      .select()
      .from(locationFaqsTable)
      .where(eq(locationFaqsTable.locationSlug, slug))
      .orderBy(asc(locationFaqsTable.position));

    return rowToLocation(row, faqRows);
  } catch (error) {
    console.error("[content] getLocationBySlug failed", error);
    return getLocationFallback(slug);
  }
}

type LocationRow = typeof locationPagesTable.$inferSelect;
type LocationFaqRow = typeof locationFaqsTable.$inferSelect;

function rowToLocation(row: LocationRow, faqRows: LocationFaqRow[]): Location {
  return {
    slug: row.slug,
    area: row.area,
    fullName: row.fullName,
    searchQuery: row.searchQuery,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    heroEyebrow: row.heroEyebrow,
    heroHeadline: row.heroHeadline,
    intro: row.intro,
    commuteHeading: row.commuteHeading,
    commuteParagraphs: row.commuteParagraphs ?? [],
    metroNote: row.metroNote,
    driveNote: row.driveNote,
    landmarks: row.landmarks ?? [],
    schools: row.schools ?? [],
    whyHere: row.whyHere,
    proofPoints: row.proofPoints ?? [],
    localFaqs: faqRows
      .filter((faq) => faq.locationSlug === row.slug)
      .map((faq) => ({ question: faq.question, answer: faq.answer })),
  };
}
