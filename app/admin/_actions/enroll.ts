"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAdminContext } from "@/lib/auth/current-user";
import { ENROLL_SECTION_KEY } from "@/lib/content/enroll";
import { getDb } from "@/lib/db/client";
import { pageSections } from "@/lib/db/schema";

import { recordAudit } from "./audit";
import {
  dbNotConfigured,
  notAuthenticated,
  type ActionResult,
} from "./types";

const ItemSchema = z.object({
  title: z.string().min(1).max(280),
  body: z.string().min(1).max(2000),
});

const EnrollContentSchema = z.object({
  hero: z.object({
    eyebrow: z.string().min(1).max(160),
    headline: z.string().min(1).max(500),
    description: z.string().min(1).max(2000),
  }),
  counselingPoints: z.array(ItemSchema).max(8),
  leadFormCopy: z.object({
    title: z.string().min(1).max(280),
    description: z.string().min(1).max(1000),
  }),
});

export type EnrollContentInput = z.infer<typeof EnrollContentSchema>;

export async function updateEnrollContentAction(
  input: EnrollContentInput,
): Promise<ActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.authenticated) return notAuthenticated();
  const db = getDb();
  if (!db) return dbNotConfigured();

  const parsed = EnrollContentSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Some fields are invalid." };

  try {
    const where = and(
      eq(pageSections.pageSlug, "enroll"),
      eq(pageSections.sectionKey, ENROLL_SECTION_KEY),
    );
    const before = await db.select().from(pageSections).where(where);

    if (before.length === 0) {
      await db.insert(pageSections).values({
        pageSlug: "enroll",
        sectionKey: ENROLL_SECTION_KEY,
        position: 0,
        content: parsed.data as unknown as Record<string, unknown>,
      });
    } else {
      await db
        .update(pageSections)
        .set({
          content: parsed.data as unknown as Record<string, unknown>,
          updatedAt: new Date(),
        })
        .where(where);
    }

    const after = await db.select().from(pageSections).where(where);
    await recordAudit({
      user: ctx.user,
      action: "update",
      entityType: "page_sections",
      entityId: `enroll/${ENROLL_SECTION_KEY}`,
      before,
      after,
    });

    revalidatePath("/enroll");

    return { ok: true, message: "Enroll page saved." };
  } catch (error) {
    console.error("[admin] updateEnrollContentAction failed", error);
    return { ok: false, message: "Could not save enroll page." };
  }
}
