"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAdminContext } from "@/lib/auth/current-user";
import { getDb } from "@/lib/db/client";
import { programs as programsTable } from "@/lib/db/schema";
import { getLocationSlugs } from "@/lib/locations";
import { slugify } from "@/lib/posts";

import { recordAudit } from "./audit";

const ProgramSchema = z.object({
  name: z.string().min(1, "Name is required").max(160),
  summary: z.string().min(1, "Summary is required").max(2000),
  bullets: z
    .array(z.string().min(1).max(500))
    .max(20, "Up to 20 bullets per program"),
});

export const ProgramsInputSchema = z
  .array(ProgramSchema)
  .max(20, "Up to 20 programs");

export type ProgramsInput = z.infer<typeof ProgramsInputSchema>;

export type ActionResult =
  | { ok: true; message?: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export async function updateProgramsAction(
  input: ProgramsInput,
): Promise<ActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.authenticated) {
    return { ok: false, message: "Not authenticated." };
  }

  const db = getDb();
  if (!db) {
    return {
      ok: false,
      message:
        "Connect a database (DATABASE_URL) to enable persistence. Edits are read-only in dev mode without it.",
    };
  }

  const parsed = ProgramsInputSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return {
      ok: false,
      message: "Some fields are invalid.",
      fieldErrors,
    };
  }

  try {
    const before = await db.select().from(programsTable);

    // neon-http does not support multi-statement transactions, so we run
    // delete + insert sequentially. The window where the table is empty is
    // sub-100ms; public readers fall back to the TS constant during it.
    await db.delete(programsTable);

    if (parsed.data.length > 0) {
      const usedSlugs = new Set<string>();
      const rows = parsed.data.map((program, index) => {
        let baseSlug = slugify(program.name) || `program-${index + 1}`;
        let slug = baseSlug;
        let counter = 2;
        while (usedSlugs.has(slug)) {
          slug = `${baseSlug}-${counter++}`;
        }
        usedSlugs.add(slug);
        return {
          slug,
          name: program.name,
          summary: program.summary,
          bullets: program.bullets,
          position: index,
        };
      });

      await db.insert(programsTable).values(rows);
    }

    const after = await db.select().from(programsTable);

    await recordAudit({
      user: ctx.user,
      action: "update",
      entityType: "programs",
      entityId: "all",
      before,
      after,
    });

    revalidatePath("/");
    revalidatePath("/enroll");
    for (const slug of getLocationSlugs()) {
      revalidatePath(`/cuet-coaching-in-${slug}`);
    }

    return { ok: true, message: "Programs saved. The public site will refresh within a few seconds." };
  } catch (error) {
    console.error("[admin] updateProgramsAction failed", error);
    return {
      ok: false,
      message:
        "Could not save programs. Check the server logs for the underlying error.",
    };
  }
}
