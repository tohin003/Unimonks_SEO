import { and, desc, eq, isNull } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { mediaAssets } from "@/lib/db/schema";

export type MediaAsset = {
  id: string;
  storageKey: string;
  publicUrl: string;
  storageDriver: "r2" | "local";
  mimeType: string;
  fileSize: number;
  width: number;
  height: number;
  altText: string;
  title: string | null;
  caption: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function mapRow(row: typeof mediaAssets.$inferSelect): MediaAsset {
  return {
    id: row.id,
    storageKey: row.storageKey,
    publicUrl: row.publicUrl,
    storageDriver: row.storageDriver === "r2" ? "r2" : "local",
    mimeType: row.mimeType,
    fileSize: row.fileSize,
    width: row.width,
    height: row.height,
    altText: row.altText ?? "",
    title: row.title,
    caption: row.caption,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function listMediaAssets(): Promise<MediaAsset[]> {
  const db = getDb();
  if (!db) return [];

  try {
    const rows = await db
      .select()
      .from(mediaAssets)
      .where(isNull(mediaAssets.deletedAt))
      .orderBy(desc(mediaAssets.createdAt));
    return rows.map(mapRow);
  } catch (error) {
    console.error("[content] listMediaAssets failed", error);
    return [];
  }
}

export async function getMediaAsset(id: string): Promise<MediaAsset | null> {
  const db = getDb();
  if (!db) return null;

  try {
    const rows = await db
      .select()
      .from(mediaAssets)
      .where(and(eq(mediaAssets.id, id), isNull(mediaAssets.deletedAt)))
      .limit(1);
    return rows[0] ? mapRow(rows[0]) : null;
  } catch (error) {
    console.error("[content] getMediaAsset failed", error);
    return null;
  }
}
