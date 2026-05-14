"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAdminContext } from "@/lib/auth/current-user";
import { getDb } from "@/lib/db/client";
import { pageSections } from "@/lib/db/schema";

import { HOME_SECTION_KEY } from "@/lib/content/home";

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

const HomeContentSchema = z.object({
  heroSubhead: z.string().min(1).max(2000),
  proofPoints: z.array(ItemSchema).max(8),
  programsIntro: z.object({
    eyebrow: z.string().min(1).max(160),
    headline: z.string().min(1).max(280),
    description: z.string().min(1).max(2000),
  }),
  supportSteps: z.object({
    eyebrow: z.string().min(1).max(160),
    headline: z.string().min(1).max(280),
    description: z.string().min(1).max(2000),
    items: z.array(ItemSchema).max(8),
  }),
  articlesIntro: z.object({
    eyebrow: z.string().min(1).max(160),
    headline: z.string().min(1).max(280),
  }),
  faqIntro: z.object({
    eyebrow: z.string().min(1).max(160),
    headline: z.string().min(1).max(280),
    description: z.string().min(1).max(2000),
  }),
  contactIntro: z.object({
    eyebrow: z.string().min(1).max(160),
    headline: z.string().min(1).max(280),
    description: z.string().min(1).max(2000),
  }),
  leadFormCopy: z.object({
    title: z.string().min(1).max(280),
    description: z.string().min(1).max(1000),
  }),
});

export type HomeContentInput = z.infer<typeof HomeContentSchema>;

export async function updateHomeContentAction(
  input: HomeContentInput,
): Promise<ActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.authenticated) return notAuthenticated();
  const db = getDb();
  if (!db) return dbNotConfigured();

  const parsed = HomeContentSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { ok: false, message: "Some fields are invalid.", fieldErrors };
  }

  try {
    const where = and(
      eq(pageSections.pageSlug, "home"),
      eq(pageSections.sectionKey, HOME_SECTION_KEY),
    );

    const before = await db.select().from(pageSections).where(where);

    if (before.length === 0) {
      await db.insert(pageSections).values({
        pageSlug: "home",
        sectionKey: HOME_SECTION_KEY,
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
      entityId: `home/${HOME_SECTION_KEY}`,
      before,
      after,
    });

    revalidatePath("/");

    return {
      ok: true,
      message: "Home page saved. The home page will refresh within a few seconds.",
    };
  } catch (error) {
    console.error("[admin] updateHomeContentAction failed", error);
    return { ok: false, message: "Could not save home page content." };
  }
}
