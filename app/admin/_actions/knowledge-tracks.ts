"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAdminContext } from "@/lib/auth/current-user";
import { getDb } from "@/lib/db/client";
import { knowledgeTracks as knowledgeTracksTable } from "@/lib/db/schema";
import { getLocationSlugs } from "@/lib/locations";
import { slugify } from "@/lib/posts";

import { recordAudit } from "./audit";
import {
  dbNotConfigured,
  notAuthenticated,
  type ActionResult,
} from "./types";

const KnowledgeTrackSchema = z.object({
  title: z.string().min(1, "Title is required").max(160),
  description: z.string().min(1, "Description is required").max(1000),
});

export const KnowledgeTracksInputSchema = z
  .array(KnowledgeTrackSchema)
  .max(20);

export type KnowledgeTracksInput = z.infer<typeof KnowledgeTracksInputSchema>;

export async function updateKnowledgeTracksAction(
  input: KnowledgeTracksInput,
): Promise<ActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.authenticated) return notAuthenticated();
  const db = getDb();
  if (!db) return dbNotConfigured();

  const parsed = KnowledgeTracksInputSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { ok: false, message: "Some fields are invalid.", fieldErrors };
  }

  try {
    const before = await db.select().from(knowledgeTracksTable);
    await db.delete(knowledgeTracksTable);

    if (parsed.data.length > 0) {
      const used = new Set<string>();
      const rows = parsed.data.map((track, index) => {
        let base = slugify(track.title) || `track-${index + 1}`;
        let slug = base;
        let n = 2;
        while (used.has(slug)) slug = `${base}-${n++}`;
        used.add(slug);
        return {
          slug,
          title: track.title,
          description: track.description,
          position: index,
        };
      });
      await db.insert(knowledgeTracksTable).values(rows);
    }

    const after = await db.select().from(knowledgeTracksTable);
    await recordAudit({
      user: ctx.user,
      action: "update",
      entityType: "knowledge_tracks",
      entityId: "all",
      before,
      after,
    });

    revalidatePath("/");
    revalidatePath("/hub");
    revalidatePath("/blog");
    for (const slug of getLocationSlugs()) {
      revalidatePath(`/cuet-coaching-in-${slug}`);
    }

    return {
      ok: true,
      message: "Knowledge tracks saved. The hub and footer will refresh shortly.",
    };
  } catch (error) {
    console.error("[admin] updateKnowledgeTracksAction failed", error);
    return { ok: false, message: "Could not save knowledge tracks." };
  }
}
