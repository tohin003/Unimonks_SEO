import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { siteSettings as siteSettingsTable } from "@/lib/db/schema";
import { siteConfig } from "@/lib/site";

export type SiteSettings = {
  name: string;
  shortName: string;
  title: string;
  description: string;
  tagline: string;
  siteUrl: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  whatsappHref: string;
  addressLines: readonly [string, string] | string[];
  postalCode: string;
  addressLocality: string;
  addressRegion: string;
  addressCountry: string;
  geo: { latitude: number; longitude: number };
  city: string;
  heroLabel: string;
  audience: string;
  differentiator: string;
  foundingDate: string;
  founder: { name: string; role: string };
  areaServed: readonly string[];
  knowsAbout: readonly string[];
  sameAs: readonly string[];
};

/**
 * Dual-source site settings reader. Returns the singleton DB row when
 * DATABASE_URL is configured and seeded; otherwise returns the bundled
 * TS constant. Shape is identical to `siteConfig` from lib/site.ts so
 * callers can drop in this getter without other changes.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const db = getDb();
  if (!db) return siteConfig as SiteSettings;

  try {
    const rows = await db
      .select()
      .from(siteSettingsTable)
      .where(eq(siteSettingsTable.id, "singleton"))
      .limit(1);
    const row = rows[0];
    if (!row) return siteConfig as SiteSettings;

    return {
      name: row.name,
      shortName: row.shortName,
      title: row.title,
      description: row.description,
      tagline: row.tagline,
      siteUrl: row.siteUrl,
      phoneDisplay: row.phoneDisplay,
      phoneHref: row.phoneHref,
      email: row.email,
      whatsappHref: row.whatsappHref,
      addressLines: [row.addressLine1, row.addressLine2],
      postalCode: row.postalCode,
      addressLocality: row.addressLocality,
      addressRegion: row.addressRegion,
      addressCountry: row.addressCountry,
      geo: {
        latitude: Number(row.geoLatitude),
        longitude: Number(row.geoLongitude),
      },
      city: siteConfig.city,
      heroLabel: row.heroLabel,
      audience: siteConfig.audience,
      differentiator: siteConfig.differentiator,
      foundingDate: row.foundingDate,
      founder: { name: row.founderName, role: row.founderRole },
      areaServed: row.areaServed ?? [],
      knowsAbout: row.knowsAbout ?? [],
      sameAs: row.sameAs ?? [],
    };
  } catch (error) {
    console.error("[content] getSiteSettings failed", error);
    return siteConfig as SiteSettings;
  }
}
