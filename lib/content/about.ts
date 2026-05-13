import { and, eq } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { pageSections } from "@/lib/db/schema";

export type AboutContent = {
  hero: { eyebrow: string; headline: string; description: string };
  foundedPanel: { eyebrow: string; description: string };
  whatWeRunPanel: { eyebrow: string; title: string; description: string };
  founderIntro: { eyebrow: string; headline: string; description: string };
  commitments: { eyebrow: string; title: string; description: string }[];
  visitIntro: { eyebrow: string; headline: string; description: string };
};

export const aboutContentFallback: AboutContent = {
  hero: {
    eyebrow: "About UNIMONKS",
    headline:
      "A Munirka coaching centre built for the way CUET actually works.",
    description:
      "UNIMONKS was founded to give CUET aspirants in South Delhi one place that treats GT, English, domain subjects, and admissions as a single coordinated programme. The Munirka centre is the home of that work — close to JNU, RK Puram, and Vasant Kunj, with batches that respect the weekly rhythm of school students rather than stretching them into burnout.",
  },
  foundedPanel: {
    eyebrow: "Founded",
    description:
      "In Munirka, New Delhi, with the goal of building a focused CUET preparation system for South Delhi.",
  },
  whatWeRunPanel: {
    eyebrow: "What we run",
    title: "Foundation · Target · Admissions",
    description:
      "Three tracks that cover the full CUET cycle — preparation, rank-oriented mocks, and DU + JNU admissions guidance.",
  },
  founderIntro: {
    eyebrow: "Founder",
    headline: "The conviction the centre is built on.",
    description:
      "CUET preparation in Delhi was scattered before UNIMONKS — GT, English, and domain papers ran as separate tracks, and admissions support stopped at the exam. The centre was built to fix that gap rather than to add another option.",
  },
  commitments: [
    {
      eyebrow: "One programme",
      title: "GT, English, domain, admissions — together.",
      description:
        "No paper is treated as the optional one. The batch schedule keeps all four threads alive each week so nothing collapses in the final month.",
    },
    {
      eyebrow: "Mocks reviewed, not just taken",
      title: "Every mock produces a written error log.",
      description:
        "Test counts are easy. Pattern recognition is hard. The centre optimises for the second because that is what moves rank.",
    },
    {
      eyebrow: "Admissions before, during, after",
      title: "Counseling continues into DU and JNU UG.",
      description:
        "Most institutes stop at exam day. UNIMONKS continues into preference lists, document readiness, and the CSAS portal so the final outcome is not left to last-minute guesswork.",
    },
    {
      eyebrow: "Local centre, real conversations",
      title: "Parents and students can walk in.",
      description:
        "The Munirka centre is set up for face-to-face progress meetings. The work is easier to trust when families can see the room their child is studying in.",
    },
  ],
  visitIntro: {
    eyebrow: "Visit the centre",
    headline: "Walk in to the Munirka centre or book a counseling call.",
    description:
      "The team prefers in-person conversations — they make batch fit, subject planning, and admissions strategy easier to talk through. Walk in any working evening or book a slot in advance.",
  },
};

export const ABOUT_SECTION_KEY = "content";

export async function getAboutContent(): Promise<AboutContent> {
  const db = getDb();
  if (!db) return aboutContentFallback;

  try {
    const rows = await db
      .select()
      .from(pageSections)
      .where(
        and(
          eq(pageSections.pageSlug, "about"),
          eq(pageSections.sectionKey, ABOUT_SECTION_KEY),
        ),
      )
      .limit(1);

    const row = rows[0];
    if (!row || !row.content) return aboutContentFallback;

    const override = row.content as Partial<AboutContent>;
    return {
      hero: { ...aboutContentFallback.hero, ...override.hero },
      foundedPanel: {
        ...aboutContentFallback.foundedPanel,
        ...override.foundedPanel,
      },
      whatWeRunPanel: {
        ...aboutContentFallback.whatWeRunPanel,
        ...override.whatWeRunPanel,
      },
      founderIntro: {
        ...aboutContentFallback.founderIntro,
        ...override.founderIntro,
      },
      commitments: override.commitments ?? aboutContentFallback.commitments,
      visitIntro: {
        ...aboutContentFallback.visitIntro,
        ...override.visitIntro,
      },
    };
  } catch (error) {
    console.error("[content] getAboutContent failed", error);
    return aboutContentFallback;
  }
}
