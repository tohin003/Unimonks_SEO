"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { getAdminContext } from "@/lib/auth/current-user";
import { getDb } from "@/lib/db/client";
import { faqItems as faqItemsTable } from "@/lib/db/schema";

import { recordAudit } from "./audit";
import {
  dbNotConfigured,
  notAuthenticated,
  type ActionResult,
} from "./types";

const FaqItemSchema = z.object({
  question: z.string().min(1, "Question is required").max(500),
  answer: z.string().min(1, "Answer is required").max(2000),
});

export const FaqInputSchema = z.array(FaqItemSchema).max(40);

export type FaqInput = z.infer<typeof FaqInputSchema>;

export async function updateHomeFaqsAction(
  input: FaqInput,
): Promise<ActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.authenticated) return notAuthenticated();
  const db = getDb();
  if (!db) return dbNotConfigured();

  const parsed = FaqInputSchema.safeParse(input);
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
      .from(faqItemsTable)
      .where(eq(faqItemsTable.scope, "home"));

    await db.delete(faqItemsTable).where(eq(faqItemsTable.scope, "home"));

    if (parsed.data.length > 0) {
      await db.insert(faqItemsTable).values(
        parsed.data.map((item, index) => ({
          scope: "home",
          question: item.question,
          answer: item.answer,
          position: index,
        })),
      );
    }

    const after = await db
      .select()
      .from(faqItemsTable)
      .where(eq(faqItemsTable.scope, "home"));

    await recordAudit({
      user: ctx.user,
      action: "update",
      entityType: "faq_items",
      entityId: "home",
      before,
      after,
    });

    revalidatePath("/");

    return {
      ok: true,
      message: "Home FAQs saved. The home page will refresh shortly.",
    };
  } catch (error) {
    console.error("[admin] updateHomeFaqsAction failed", error);
    return { ok: false, message: "Could not save FAQs." };
  }
}
