"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAdminContext } from "@/lib/auth/current-user";
import { ABOUT_SECTION_KEY } from "@/lib/content/about";
import { getDb } from "@/lib/db/client";
import { pageSections } from "@/lib/db/schema";

import { recordAudit } from "./audit";
import {
  dbNotConfigured,
  notAuthenticated,
  type ActionResult,
} from "./types";

const SectionIntro = z.object({
  eyebrow: z.string().min(1).max(160),
  headline: z.string().min(1).max(500),
  description: z.string().min(1).max(2000),
});

const CommitmentSchema = z.object({
  eyebrow: z.string().min(1).max(160),
  title: z.string().min(1).max(280),
  description: z.string().min(1).max(2000),
});

const AboutContentSchema = z.object({
  hero: SectionIntro,
  foundedPanel: z.object({
    eyebrow: z.string().min(1).max(160),
    description: z.string().min(1).max(2000),
  }),
  whatWeRunPanel: z.object({
    eyebrow: z.string().min(1).max(160),
    title: z.string().min(1).max(280),
    description: z.string().min(1).max(2000),
  }),
  founderIntro: SectionIntro,
  commitments: z.array(CommitmentSchema).max(8),
  visitIntro: SectionIntro,
});

export type AboutContentInput = z.infer<typeof AboutContentSchema>;

export async function updateAboutContentAction(
  input: AboutContentInput,
): Promise<ActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.authenticated) return notAuthenticated();
  const db = getDb();
  if (!db) return dbNotConfigured();

  const parsed = AboutContentSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Some fields are invalid." };

  try {
    const where = and(
      eq(pageSections.pageSlug, "about"),
      eq(pageSections.sectionKey, ABOUT_SECTION_KEY),
    );
    const before = await db.select().from(pageSections).where(where);

    if (before.length === 0) {
      await db.insert(pageSections).values({
        pageSlug: "about",
        sectionKey: ABOUT_SECTION_KEY,
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
      entityId: `about/${ABOUT_SECTION_KEY}`,
      before,
      after,
    });

    revalidatePath("/about");

    return { ok: true, message: "About page saved." };
  } catch (error) {
    console.error("[admin] updateAboutContentAction failed", error);
    return { ok: false, message: "Could not save about page." };
  }
}
