"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAdminContext } from "@/lib/auth/current-user";
import { getDb } from "@/lib/db/client";
import {
  locationFaqs as locationFaqsTable,
  locationPages as locationPagesTable,
} from "@/lib/db/schema";

import { recordAudit } from "./audit";
import {
  dbNotConfigured,
  notAuthenticated,
  type ActionResult,
} from "./types";

const ProofPointSchema = z.object({
  title: z.string().min(1).max(280),
  body: z.string().min(1).max(2000),
});

const LocalFaqSchema = z.object({
  question: z.string().min(1).max(500),
  answer: z.string().min(1).max(2000),
});

const LocationInputSchema = z.object({
  slug: z.string().min(1).max(120),
  area: z.string().min(1).max(160),
  fullName: z.string().min(1).max(280),
  searchQuery: z.string().min(1).max(280),
  metaTitle: z.string().min(1).max(280),
  metaDescription: z.string().min(1).max(2000),
  heroEyebrow: z.string().min(1).max(280),
  heroHeadline: z.string().min(1).max(500),
  intro: z.string().min(1).max(4000),
  commuteHeading: z.string().min(1).max(280),
  commuteParagraphs: z.array(z.string().min(1).max(2000)).max(10),
  metroNote: z.string().min(1).max(500),
  driveNote: z.string().min(1).max(500),
  landmarks: z.array(z.string().min(1).max(280)).max(20),
  schools: z.array(z.string().min(1).max(280)).max(20),
  whyHere: z.string().min(1).max(2000),
  proofPoints: z.array(ProofPointSchema).max(8),
  localFaqs: z.array(LocalFaqSchema).max(12),
});

export type LocationInput = z.infer<typeof LocationInputSchema>;

export async function updateLocationAction(
  originalSlug: string,
  input: LocationInput,
): Promise<ActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.authenticated) return notAuthenticated();
  const db = getDb();
  if (!db) return dbNotConfigured();

  const parsed = LocationInputSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { ok: false, message: "Some fields are invalid.", fieldErrors };
  }

  try {
    const existing = await db
      .select()
      .from(locationPagesTable)
      .where(eq(locationPagesTable.slug, originalSlug))
      .limit(1);
    const existingRow = existing[0];

    const beforeFaqs = await db
      .select()
      .from(locationFaqsTable)
      .where(eq(locationFaqsTable.locationSlug, originalSlug));

    const values = {
      slug: parsed.data.slug,
      area: parsed.data.area,
      fullName: parsed.data.fullName,
      searchQuery: parsed.data.searchQuery,
      metaTitle: parsed.data.metaTitle,
      metaDescription: parsed.data.metaDescription,
      heroEyebrow: parsed.data.heroEyebrow,
      heroHeadline: parsed.data.heroHeadline,
      intro: parsed.data.intro,
      commuteHeading: parsed.data.commuteHeading,
      commuteParagraphs: parsed.data.commuteParagraphs,
      metroNote: parsed.data.metroNote,
      driveNote: parsed.data.driveNote,
      landmarks: parsed.data.landmarks,
      schools: parsed.data.schools,
      whyHere: parsed.data.whyHere,
      proofPoints: parsed.data.proofPoints,
      position: existingRow?.position ?? 0,
      updatedAt: new Date(),
    };

    if (!existingRow) {
      await db.insert(locationPagesTable).values(values);
    } else {
      await db
        .update(locationPagesTable)
        .set(values)
        .where(eq(locationPagesTable.slug, originalSlug));
    }

    // Replace FAQs for this location.
    await db
      .delete(locationFaqsTable)
      .where(eq(locationFaqsTable.locationSlug, originalSlug));

    if (parsed.data.localFaqs.length > 0) {
      await db.insert(locationFaqsTable).values(
        parsed.data.localFaqs.map((faq, index) => ({
          locationSlug: parsed.data.slug,
          question: faq.question,
          answer: faq.answer,
          position: index,
        })),
      );
    }

    const afterRows = await db
      .select()
      .from(locationPagesTable)
      .where(eq(locationPagesTable.slug, parsed.data.slug));
    const afterFaqs = await db
      .select()
      .from(locationFaqsTable)
      .where(eq(locationFaqsTable.locationSlug, parsed.data.slug));

    await recordAudit({
      user: ctx.user,
      action: "update",
      entityType: "location_pages",
      entityId: parsed.data.slug,
      before: { row: existingRow, faqs: beforeFaqs },
      after: { row: afterRows[0], faqs: afterFaqs },
    });

    revalidatePath(`/cuet-coaching-in-${parsed.data.slug}`);
    if (originalSlug !== parsed.data.slug) {
      revalidatePath(`/cuet-coaching-in-${originalSlug}`);
    }
    revalidatePath("/sitemap.xml");
    revalidatePath("/");

    return {
      ok: true,
      message: "Location saved. The matching public page revalidates shortly.",
    };
  } catch (error) {
    console.error("[admin] updateLocationAction failed", error);
    return { ok: false, message: "Could not save location." };
  }
}
