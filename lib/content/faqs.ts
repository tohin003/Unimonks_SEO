import { asc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { faqItems as faqItemsTable } from "@/lib/db/schema";
import { faqItems as faqItemsFallback, type FaqItem } from "@/lib/site";

export async function getFaqItems(
  scope: string = "home",
): Promise<FaqItem[]> {
  const db = getDb();
  if (!db) {
    return scope === "home" ? [...faqItemsFallback] : [];
  }

  try {
    const rows = await db
      .select()
      .from(faqItemsTable)
      .where(eq(faqItemsTable.scope, scope))
      .orderBy(asc(faqItemsTable.position));

    if (rows.length === 0 && scope === "home") {
      return [...faqItemsFallback];
    }

    return rows.map((row) => ({
      question: row.question,
      answer: row.answer,
    }));
  } catch (error) {
    console.error("[content] getFaqItems failed", error);
    return scope === "home" ? [...faqItemsFallback] : [];
  }
}

