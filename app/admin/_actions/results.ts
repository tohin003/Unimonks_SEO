"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAdminContext } from "@/lib/auth/current-user";
import { getDb } from "@/lib/db/client";
import {
  outcomeGroups as outcomeGroupsTable,
  studentOutcomes as studentOutcomesTable,
} from "@/lib/db/schema";
import { slugify } from "@/lib/posts";

import { recordAudit } from "./audit";
import {
  dbNotConfigured,
  notAuthenticated,
  type ActionResult,
} from "./types";

const OutcomeSchema = z.object({
  studentInitials: z.string().min(1).max(40),
  cuetYear: z.number().int().min(2020).max(2100),
  college: z.string().min(1).max(280),
  course: z.string().min(1).max(280),
  percentile: z
    .number()
    .min(0)
    .max(100)
    .optional()
    .nullable()
    .transform((value) => (value == null ? undefined : value)),
  highlight: z.string().max(500).optional().or(z.literal("")),
  verified: z.boolean().optional().default(false),
});

const GroupSchema = z.object({
  slug: z.string().min(1).max(120),
  title: z.string().min(1).max(280),
  description: z.string().min(1).max(2000),
  outcomes: z.array(OutcomeSchema).max(40),
});

const ResultsInputSchema = z.array(GroupSchema).max(10);

export type ResultsInput = z.infer<typeof ResultsInputSchema>;

export async function updateResultsAction(
  input: ResultsInput,
): Promise<ActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.authenticated) return notAuthenticated();
  const db = getDb();
  if (!db) return dbNotConfigured();

  const parsed = ResultsInputSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { ok: false, message: "Some fields are invalid.", fieldErrors };
  }

  try {
    const beforeGroups = await db.select().from(outcomeGroupsTable);
    const beforeOutcomes = await db.select().from(studentOutcomesTable);

    // Slug normalisation + collision protection.
    const usedSlugs = new Set<string>();
    const groupRows = parsed.data.map((group, index) => {
      let base = slugify(group.slug || group.title) || `group-${index + 1}`;
      let slug = base;
      let n = 2;
      while (usedSlugs.has(slug)) slug = `${base}-${n++}`;
      usedSlugs.add(slug);
      return { ...group, slug, position: index };
    });

    // Replace groups + outcomes in a delete-then-insert sweep.
    await db.delete(studentOutcomesTable);
    await db.delete(outcomeGroupsTable);

    if (groupRows.length > 0) {
      await db.insert(outcomeGroupsTable).values(
        groupRows.map((group) => ({
          slug: group.slug,
          title: group.title,
          description: group.description,
          position: group.position,
        })),
      );

      const outcomeRows = groupRows.flatMap((group) =>
        group.outcomes.map((outcome, position) => ({
          groupSlug: group.slug,
          studentInitials: outcome.studentInitials,
          cuetYear: outcome.cuetYear,
          college: outcome.college,
          course: outcome.course,
          percentile:
            outcome.percentile != null ? String(outcome.percentile) : null,
          highlight:
            outcome.highlight && outcome.highlight.length > 0
              ? outcome.highlight
              : null,
          verified: outcome.verified ?? false,
          position,
        })),
      );

      if (outcomeRows.length > 0) {
        await db.insert(studentOutcomesTable).values(outcomeRows);
      }
    }

    const afterGroups = await db.select().from(outcomeGroupsTable);
    const afterOutcomes = await db.select().from(studentOutcomesTable);

    await recordAudit({
      user: ctx.user,
      action: "update",
      entityType: "results",
      entityId: "all",
      before: { groups: beforeGroups, outcomes: beforeOutcomes },
      after: { groups: afterGroups, outcomes: afterOutcomes },
    });

    revalidatePath("/results");
    revalidatePath("/");

    return {
      ok: true,
      message: "Results saved. The /results page revalidates shortly.",
    };
  } catch (error) {
    console.error("[admin] updateResultsAction failed", error);
    return { ok: false, message: "Could not save results." };
  }
}
