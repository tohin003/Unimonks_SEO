import { asc } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { programs as programsTable } from "@/lib/db/schema";
import { programs as programsFallback, type Program } from "@/lib/site";

/**
 * Dual-source program reader. Returns DB-backed rows when DATABASE_URL is
 * configured and the table has been seeded; otherwise returns the bundled
 * TS-constant programs from lib/site.ts.
 */
export async function getPrograms(): Promise<Program[]> {
  const db = getDb();
  if (!db) {
    return [...programsFallback];
  }

  try {
    const rows = await db
      .select()
      .from(programsTable)
      .orderBy(asc(programsTable.position));

    if (rows.length === 0) {
      return [...programsFallback];
    }

    return rows.map((row) => ({
      name: row.name,
      summary: row.summary,
      bullets: row.bullets ?? [],
    }));
  } catch (error) {
    console.error("[content] getPrograms failed; falling back to constant", error);
    return [...programsFallback];
  }
}
