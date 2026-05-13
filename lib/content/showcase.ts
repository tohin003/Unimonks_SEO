import { asc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { imageShowcaseSlides, mediaAssets } from "@/lib/db/schema";

export type ShowcaseSlide = {
  id: string;
  assetId: string;
  publicUrl: string;
  alt: string;
  width: number;
  height: number;
  headline: string;
  subhead: string | null;
  linkUrl: string | null;
  enabled: boolean;
  position: number;
};

async function fetchSlides({
  enabledOnly,
}: {
  enabledOnly: boolean;
}): Promise<ShowcaseSlide[]> {
  const db = getDb();
  if (!db) return [];

  try {
    const rows = await db
      .select({
        id: imageShowcaseSlides.id,
        assetId: imageShowcaseSlides.assetId,
        headline: imageShowcaseSlides.headline,
        subhead: imageShowcaseSlides.subhead,
        linkUrl: imageShowcaseSlides.linkUrl,
        enabled: imageShowcaseSlides.enabled,
        position: imageShowcaseSlides.position,
        publicUrl: mediaAssets.publicUrl,
        altText: mediaAssets.altText,
        width: mediaAssets.width,
        height: mediaAssets.height,
        deletedAt: mediaAssets.deletedAt,
      })
      .from(imageShowcaseSlides)
      .leftJoin(mediaAssets, eq(imageShowcaseSlides.assetId, mediaAssets.id))
      .orderBy(asc(imageShowcaseSlides.position));

    return rows
      .filter((row) => row.publicUrl && row.deletedAt === null)
      .filter((row) => (enabledOnly ? row.enabled === 1 : true))
      .map((row) => ({
        id: row.id,
        assetId: row.assetId,
        publicUrl: row.publicUrl ?? "",
        alt: row.altText ?? "",
        width: row.width ?? 1,
        height: row.height ?? 1,
        headline: row.headline,
        subhead: row.subhead,
        linkUrl: row.linkUrl,
        enabled: row.enabled === 1,
        position: row.position,
      }));
  } catch (error) {
    console.error("[content] fetchSlides failed", error);
    return [];
  }
}

export async function listShowcaseSlides(): Promise<ShowcaseSlide[]> {
  return fetchSlides({ enabledOnly: false });
}

export async function listEnabledShowcaseSlides(): Promise<ShowcaseSlide[]> {
  return fetchSlides({ enabledOnly: true });
}

/**
 * Returns slides whose backing asset has been soft-deleted or never existed.
 * Useful for the admin to surface broken slides without breaking the public
 * render path.
 */
export async function listOrphanShowcaseSlideIds(): Promise<string[]> {
  const db = getDb();
  if (!db) return [];
  try {
    const rows = await db
      .select({
        id: imageShowcaseSlides.id,
        publicUrl: mediaAssets.publicUrl,
        deletedAt: mediaAssets.deletedAt,
      })
      .from(imageShowcaseSlides)
      .leftJoin(mediaAssets, eq(imageShowcaseSlides.assetId, mediaAssets.id));
    return rows
      .filter((row) => !row.publicUrl || row.deletedAt !== null)
      .map((row) => row.id);
  } catch (error) {
    console.error("[content] listOrphanShowcaseSlideIds failed", error);
    return [];
  }
}

