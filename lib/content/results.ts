import { asc } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import {
  outcomeGroups as outcomeGroupsTable,
  studentOutcomes as studentOutcomesTable,
} from "@/lib/db/schema";
import {
  outcomeGroups as outcomeGroupsFallback,
  type OutcomeGroup,
} from "@/lib/results";

export async function getOutcomeGroups(): Promise<OutcomeGroup[]> {
  const db = getDb();
  if (!db) return [...outcomeGroupsFallback];

  try {
    const groupRows = await db
      .select()
      .from(outcomeGroupsTable)
      .orderBy(asc(outcomeGroupsTable.position));

    if (groupRows.length === 0) return [...outcomeGroupsFallback];

    const outcomeRows = await db
      .select()
      .from(studentOutcomesTable)
      .orderBy(asc(studentOutcomesTable.position));

    return groupRows.map((group) => ({
      slug: group.slug,
      title: group.title,
      description: group.description,
      outcomes: outcomeRows
        .filter((outcome) => outcome.groupSlug === group.slug)
        .map((outcome) => ({
          studentInitials: outcome.studentInitials,
          cuetYear: outcome.cuetYear,
          college: outcome.college,
          course: outcome.course,
          percentile:
            outcome.percentile != null ? Number(outcome.percentile) : undefined,
          highlight: outcome.highlight ?? undefined,
          verified: outcome.verified,
        })),
    }));
  } catch (error) {
    console.error("[content] getOutcomeGroups failed", error);
    return [...outcomeGroupsFallback];
  }
}

