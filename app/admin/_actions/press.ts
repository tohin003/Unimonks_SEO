"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAdminContext } from "@/lib/auth/current-user";
import { getDb } from "@/lib/db/client";
import { pressMentions as pressMentionsTable } from "@/lib/db/schema";

import { recordAudit } from "./audit";
import {
  dbNotConfigured,
  notAuthenticated,
  type ActionResult,
} from "./types";

const PressMentionSchema = z.object({
  publication: z
    .string()
    .min(1, "Publication name is required")
    .max(160),
  url: z
    .string()
    .url("Must be a valid URL")
    .max(500)
    .optional()
    .or(z.literal("")),
});

const PressMentionsInputSchema = z.array(PressMentionSchema).max(30);

export type PressMentionsInput = z.infer<typeof PressMentionsInputSchema>;

export async function updatePressMentionsAction(
  input: PressMentionsInput,
): Promise<ActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.authenticated) return notAuthenticated();
  const db = getDb();
  if (!db) return dbNotConfigured();

  const parsed = PressMentionsInputSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { ok: false, message: "Some fields are invalid.", fieldErrors };
  }

  try {
    const before = await db.select().from(pressMentionsTable);
    await db.delete(pressMentionsTable);

    if (parsed.data.length > 0) {
      await db.insert(pressMentionsTable).values(
        parsed.data.map((mention, index) => ({
          publication: mention.publication,
          url: mention.url && mention.url.length > 0 ? mention.url : null,
          position: index,
        })),
      );
    }

    const after = await db.select().from(pressMentionsTable);

    await recordAudit({
      user: ctx.user,
      action: "update",
      entityType: "press_mentions",
      entityId: "all",
      before,
      after,
    });

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/faculty");
    revalidatePath("/results");

    return {
      ok: true,
      message: "Press mentions saved. Home, About, Faculty, and Results will refresh shortly.",
    };
  } catch (error) {
    console.error("[admin] updatePressMentionsAction failed", error);
    return { ok: false, message: "Could not save press mentions." };
  }
}
