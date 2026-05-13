import { asc } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { knowledgeTracks as knowledgeTracksTable } from "@/lib/db/schema";
import {
  knowledgeTracks as knowledgeTracksFallback,
  type KnowledgeTrack,
} from "@/lib/site";

export async function getKnowledgeTracks(): Promise<KnowledgeTrack[]> {
  const db = getDb();
  if (!db) return [...knowledgeTracksFallback];

  try {
    const rows = await db
      .select()
      .from(knowledgeTracksTable)
      .orderBy(asc(knowledgeTracksTable.position));

    if (rows.length === 0) return [...knowledgeTracksFallback];

    return rows.map((row) => ({
      title: row.title,
      description: row.description,
    }));
  } catch (error) {
    console.error("[content] getKnowledgeTracks failed", error);
    return [...knowledgeTracksFallback];
  }
}
