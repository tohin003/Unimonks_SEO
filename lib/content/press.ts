import { asc } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { pressMentions as pressMentionsTable } from "@/lib/db/schema";
import { pressMentions as pressMentionsFallback, type PressMention } from "@/lib/press";

export async function getPressMentions(): Promise<PressMention[]> {
  const db = getDb();
  if (!db) return [...pressMentionsFallback];

  try {
    const rows = await db
      .select()
      .from(pressMentionsTable)
      .orderBy(asc(pressMentionsTable.position));

    if (rows.length === 0) return [...pressMentionsFallback];

    return rows.map((row) => ({
      publication: row.publication,
      url: row.url ?? undefined,
    }));
  } catch (error) {
    console.error("[content] getPressMentions failed", error);
    return [...pressMentionsFallback];
  }
}
