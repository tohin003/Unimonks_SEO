import { and, eq } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { pageSections } from "@/lib/db/schema";

export type HubContent = {
  hero: { eyebrow: string; headline: string; description: string };
  howToUse: { eyebrow: string; headline: string; description: string };
  leadFormCopy: { title: string; description: string };
};

export const hubContentFallback: HubContent = {
  hero: {
    eyebrow: "CUET Study Resources",
    headline:
      "Articles and topic clusters that help students prepare with more clarity.",
    description:
      "Use the hub to read about GT, English, domain subjects, admissions strategy, and the questions students usually ask before choosing CUET coaching in Munirka.",
  },
  howToUse: {
    eyebrow: "How To Use This Page",
    headline: "Start with the topic that matches your biggest question.",
    description:
      "If you are confused about coaching, start with local guidance. If GT, English, or admissions feels weak, choose that topic and keep reading in sequence. The goal is to turn search visits into real understanding.",
  },
  leadFormCopy: {
    title: "Ask for a call from the team",
    description:
      "Share what you need help with and UNIMONKS will guide you on batches, preparation, and admissions support.",
  },
};

export const HUB_SECTION_KEY = "content";

export async function getHubContent(): Promise<HubContent> {
  const db = getDb();
  if (!db) return hubContentFallback;

  try {
    const rows = await db
      .select()
      .from(pageSections)
      .where(
        and(
          eq(pageSections.pageSlug, "hub"),
          eq(pageSections.sectionKey, HUB_SECTION_KEY),
        ),
      )
      .limit(1);

    const row = rows[0];
    if (!row || !row.content) return hubContentFallback;

    const override = row.content as Partial<HubContent>;
    return {
      hero: { ...hubContentFallback.hero, ...override.hero },
      howToUse: { ...hubContentFallback.howToUse, ...override.howToUse },
      leadFormCopy: {
        ...hubContentFallback.leadFormCopy,
        ...override.leadFormCopy,
      },
    };
  } catch (error) {
    console.error("[content] getHubContent failed", error);
    return hubContentFallback;
  }
}
