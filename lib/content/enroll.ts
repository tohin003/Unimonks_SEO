import { and, eq } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { pageSections } from "@/lib/db/schema";

export type EnrollContent = {
  hero: { eyebrow: string; headline: string; description: string };
  counselingPoints: { title: string; body: string }[];
  leadFormCopy: { title: string; description: string };
};

export const enrollContentFallback: EnrollContent = {
  hero: {
    eyebrow: "Book Counseling",
    headline:
      "Speak with the UNIMONKS team before you choose your next step.",
    description:
      "Use this page to ask about CUET coaching in Munirka, batch options, GT and English support, domain subjects, or admissions guidance. The form below includes a phone number field so the team can call you back directly.",
  },
  counselingPoints: [
    {
      title: "Batch guidance",
      body: "Understand which course or batch makes sense for your class, exam year, and target universities.",
    },
    {
      title: "Subject planning",
      body: "Discuss GT, English, and domain subject balance so your preparation is realistic from the start.",
    },
    {
      title: "Admissions clarity",
      body: "Get help with the bigger picture too, including DU goals, counseling, and what happens after the exam.",
    },
  ],
  leadFormCopy: {
    title: "Book your CUET counseling session",
    description:
      "Share your name, phone number, exam year, and what you need help with. The team will follow up with the right next step.",
  },
};

export const ENROLL_SECTION_KEY = "content";

export async function getEnrollContent(): Promise<EnrollContent> {
  const db = getDb();
  if (!db) return enrollContentFallback;

  try {
    const rows = await db
      .select()
      .from(pageSections)
      .where(
        and(
          eq(pageSections.pageSlug, "enroll"),
          eq(pageSections.sectionKey, ENROLL_SECTION_KEY),
        ),
      )
      .limit(1);

    const row = rows[0];
    if (!row || !row.content) return enrollContentFallback;

    const override = row.content as Partial<EnrollContent>;
    return {
      hero: { ...enrollContentFallback.hero, ...override.hero },
      counselingPoints:
        override.counselingPoints ?? enrollContentFallback.counselingPoints,
      leadFormCopy: {
        ...enrollContentFallback.leadFormCopy,
        ...override.leadFormCopy,
      },
    };
  } catch (error) {
    console.error("[content] getEnrollContent failed", error);
    return enrollContentFallback;
  }
}
