import { and, eq } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { pageSections } from "@/lib/db/schema";

export type HomeContent = {
  heroSubhead: string;
  proofPoints: { title: string; body: string }[];
  programsIntro: { eyebrow: string; headline: string; description: string };
  supportSteps: {
    eyebrow: string;
    headline: string;
    description: string;
    items: { title: string; body: string }[];
  };
  articlesIntro: { eyebrow: string; headline: string };
  faqIntro: { eyebrow: string; headline: string; description: string };
  contactIntro: { eyebrow: string; headline: string; description: string };
  leadFormCopy: { title: string; description: string };
};

export const homeContentFallback: HomeContent = {
  heroSubhead:
    "UNIMONKS curates GT, English, domain classes, mock review, and admissions support into one calm, high-trust preparation journey in Munirka, New Delhi.",
  proofPoints: [
    {
      title: "Local support in Munirka",
      body: "Students and parents get a nearby center for counseling, follow-ups, and face-to-face guidance instead of a distant online-only setup.",
    },
    {
      title: "Practical CUET preparation",
      body: "Classes and content stay focused on GT, English, domain subjects, mock review, and a study plan students can actually sustain.",
    },
    {
      title: "Admissions guidance after the exam",
      body: "Support continues into college choices, document planning, and next-step decisions instead of stopping at test day.",
    },
  ],
  programsIntro: {
    eyebrow: "Courses",
    headline: "Coaching plans built around real CUET needs.",
    description:
      "Strong preparation is not only about content quantity. Students usually need GT, English, domain support, mock feedback, and admission clarity working together.",
  },
  supportSteps: {
    eyebrow: "How Students Use The Site",
    headline: "Learn first, then take the next step with confidence.",
    description:
      "This website is designed to be useful before it asks for a form submission. Students can understand the exam, read practical articles, and then ask for personal guidance when they are ready.",
    items: [
      {
        title: "Plan your preparation",
        body: "Understand how GT, English, and domain subjects fit into one realistic weekly routine instead of scattered study.",
      },
      {
        title: "Read practical guidance",
        body: "Use the articles and resources to compare coaching options, improve revision, and prepare for DU admissions.",
      },
      {
        title: "Speak to the team",
        body: "Book counseling when you want batch guidance, local support in Munirka, or help after the exam.",
      },
    ],
  },
  articlesIntro: {
    eyebrow: "Latest Articles",
    headline: "CUET articles, strategy notes, and admission guidance.",
  },
  faqIntro: {
    eyebrow: "FAQs",
    headline: "Answers students and parents usually need first.",
    description:
      "Clear headings, useful answers, and strong internal links help both search engines and students understand what the business actually offers.",
  },
  contactIntro: {
    eyebrow: "Visit UNIMONKS In Munirka",
    headline: "Local trust matters when preparation needs consistency.",
    description:
      "The Munirka center gives students and parents a real place to ask questions, review progress, discuss batches, and stay close to the counseling process.",
  },
  leadFormCopy: {
    title: "Talk to the UNIMONKS team",
    description:
      "Share your details and the team will help you choose the right batch, discuss your subject needs, and guide you on the next step.",
  },
};

export const HOME_SECTION_KEY = "content";

export async function getHomeContent(): Promise<HomeContent> {
  const db = getDb();
  if (!db) return homeContentFallback;

  try {
    const rows = await db
      .select()
      .from(pageSections)
      .where(
        and(
          eq(pageSections.pageSlug, "home"),
          eq(pageSections.sectionKey, HOME_SECTION_KEY),
        ),
      )
      .limit(1);

    const row = rows[0];
    if (!row || !row.content) return homeContentFallback;

    // Lightweight merge — any missing key falls back to default to survive
    // schema additions between deployments.
    return mergeHome(homeContentFallback, row.content as Partial<HomeContent>);
  } catch (error) {
    console.error("[content] getHomeContent failed", error);
    return homeContentFallback;
  }
}

function mergeHome(base: HomeContent, override: Partial<HomeContent>): HomeContent {
  return {
    heroSubhead: override.heroSubhead ?? base.heroSubhead,
    proofPoints: override.proofPoints ?? base.proofPoints,
    programsIntro: { ...base.programsIntro, ...override.programsIntro },
    supportSteps: {
      ...base.supportSteps,
      ...override.supportSteps,
      items: override.supportSteps?.items ?? base.supportSteps.items,
    },
    articlesIntro: { ...base.articlesIntro, ...override.articlesIntro },
    faqIntro: { ...base.faqIntro, ...override.faqIntro },
    contactIntro: { ...base.contactIntro, ...override.contactIntro },
    leadFormCopy: { ...base.leadFormCopy, ...override.leadFormCopy },
  };
}
