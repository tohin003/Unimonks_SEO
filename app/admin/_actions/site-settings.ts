"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAdminContext } from "@/lib/auth/current-user";
import { getDb } from "@/lib/db/client";
import { siteSettings as siteSettingsTable } from "@/lib/db/schema";
import { getLocationSlugs } from "@/lib/locations";

import { recordAudit } from "./audit";
import {
  dbNotConfigured,
  notAuthenticated,
  type ActionResult,
} from "./types";

export const SiteSettingsInputSchema = z.object({
  name: z.string().min(1).max(160),
  shortName: z.string().min(1).max(160),
  title: z.string().min(1).max(280),
  description: z.string().min(1).max(2000),
  tagline: z.string().max(280),
  siteUrl: z.string().url(),
  phoneDisplay: z.string().min(1).max(60),
  phoneHref: z.string().min(1).max(60),
  email: z.string().email(),
  whatsappHref: z.string().min(1).max(500),
  addressLine1: z.string().min(1).max(280),
  addressLine2: z.string().min(1).max(280),
  postalCode: z.string().min(1).max(20),
  addressLocality: z.string().min(1).max(120),
  addressRegion: z.string().min(1).max(120),
  addressCountry: z.string().min(1).max(120),
  geoLatitude: z.string().min(1).max(40),
  geoLongitude: z.string().min(1).max(40),
  heroLabel: z.string().min(1).max(280),
  foundingDate: z.string().min(1).max(40),
  founderName: z.string().min(1).max(280),
  founderRole: z.string().min(1).max(280),
  areaServed: z.array(z.string().min(1).max(160)).max(40),
  knowsAbout: z.array(z.string().min(1).max(280)).max(40),
  sameAs: z
    .array(
      z
        .string()
        .url("Each social link must be a full https:// URL")
        .max(500),
    )
    .max(20),
});

export type SiteSettingsInput = z.infer<typeof SiteSettingsInputSchema>;

export async function updateSiteSettingsAction(
  input: SiteSettingsInput,
): Promise<ActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.authenticated) return notAuthenticated();
  const db = getDb();
  if (!db) return dbNotConfigured();

  const parsed = SiteSettingsInputSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { ok: false, message: "Some fields are invalid.", fieldErrors };
  }

  try {
    const before = await db
      .select()
      .from(siteSettingsTable)
      .where(eq(siteSettingsTable.id, "singleton"));

    const values = {
      id: "singleton",
      name: parsed.data.name,
      shortName: parsed.data.shortName,
      title: parsed.data.title,
      description: parsed.data.description,
      tagline: parsed.data.tagline,
      siteUrl: parsed.data.siteUrl,
      phoneDisplay: parsed.data.phoneDisplay,
      phoneHref: parsed.data.phoneHref,
      email: parsed.data.email,
      whatsappHref: parsed.data.whatsappHref,
      addressLine1: parsed.data.addressLine1,
      addressLine2: parsed.data.addressLine2,
      postalCode: parsed.data.postalCode,
      addressLocality: parsed.data.addressLocality,
      addressRegion: parsed.data.addressRegion,
      addressCountry: parsed.data.addressCountry,
      geoLatitude: parsed.data.geoLatitude,
      geoLongitude: parsed.data.geoLongitude,
      heroLabel: parsed.data.heroLabel,
      foundingDate: parsed.data.foundingDate,
      founderName: parsed.data.founderName,
      founderRole: parsed.data.founderRole,
      areaServed: parsed.data.areaServed,
      knowsAbout: parsed.data.knowsAbout,
      sameAs: parsed.data.sameAs,
    };

    if (before.length === 0) {
      await db.insert(siteSettingsTable).values(values);
    } else {
      await db
        .update(siteSettingsTable)
        .set(values)
        .where(eq(siteSettingsTable.id, "singleton"));
    }

    const after = await db
      .select()
      .from(siteSettingsTable)
      .where(eq(siteSettingsTable.id, "singleton"));

    await recordAudit({
      user: ctx.user,
      action: "update",
      entityType: "site_settings",
      entityId: "singleton",
      before,
      after,
    });

    // Site settings appear on every page; revalidate the whole site.
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/faculty");
    revalidatePath("/results");
    revalidatePath("/hub");
    revalidatePath("/enroll");
    revalidatePath("/blog");
    for (const slug of getLocationSlugs()) {
      revalidatePath(`/cuet-coaching-in-${slug}`);
    }
    revalidatePath("/sitemap.xml");

    return {
      ok: true,
      message: "Site settings saved. Every page revalidates within a few seconds.",
    };
  } catch (error) {
    console.error("[admin] updateSiteSettingsAction failed", error);
    return { ok: false, message: "Could not save site settings." };
  }
}
