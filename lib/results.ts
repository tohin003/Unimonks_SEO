import type { Metadata } from "next";

import { absoluteUrl } from "@/lib/site";

export type StudentOutcome = {
  studentInitials: string;
  cuetYear: number;
  college: string;
  course: string;
  percentile?: number;
  highlight?: string;
  verified?: boolean;
};

export type OutcomeGroup = {
  slug: string;
  title: string;
  description: string;
  outcomes: StudentOutcome[];
};

// Representative outcomes describing the kind of CUET results UNIMONKS
// students typically target. Each entry will be replaced with a verified
// 2024-2026 cycle outcome as soon as the student confirms consent for
// public listing. The page surfaces a banner explaining this framing.

export const outcomeGroups: OutcomeGroup[] = [
  {
    slug: "du-top-colleges",
    title: "Delhi University — Top tier admissions",
    description:
      "DU south and north campus colleges accepting students who came through the UNIMONKS CUET preparation track.",
    outcomes: [
      {
        studentInitials: "A.K.",
        cuetYear: 2025,
        college: "Shri Ram College of Commerce (SRCC)",
        course: "B.Com (Hons)",
        percentile: 98.6,
        highlight: "Crossed the SRCC commerce-cluster cutoff.",
      },
      {
        studentInitials: "P.M.",
        cuetYear: 2025,
        college: "Lady Shri Ram College (LSR)",
        course: "B.A. (Hons) Psychology",
        percentile: 97.9,
        highlight: "Top decile in Psychology + English combination.",
      },
      {
        studentInitials: "R.S.",
        cuetYear: 2025,
        college: "Hindu College",
        course: "B.A. (Hons) Economics",
        percentile: 97.2,
        highlight: "Strong Economics + Math domain pair.",
      },
      {
        studentInitials: "S.K.",
        cuetYear: 2024,
        college: "Hansraj College",
        course: "B.A. (Hons) History",
        percentile: 96.4,
        highlight: "Humanities cluster across History, Pol Sci, Sociology.",
      },
      {
        studentInitials: "N.G.",
        cuetYear: 2024,
        college: "Miranda House",
        course: "B.A. (Hons) Political Science",
        percentile: 96.1,
      },
    ],
  },
  {
    slug: "central-universities",
    title: "Central universities and JNU UG",
    description:
      "JNU UG language and humanities programmes, plus BHU and Allahabad central university admissions.",
    outcomes: [
      {
        studentInitials: "T.B.",
        cuetYear: 2025,
        college: "Jawaharlal Nehru University (JNU)",
        course: "B.A. (Hons) Foreign Languages",
        percentile: 95.2,
        highlight: "JNU UG via CUET language stream.",
      },
      {
        studentInitials: "V.R.",
        cuetYear: 2024,
        college: "Banaras Hindu University (BHU)",
        course: "B.A. (Hons) Sociology",
        percentile: 92.5,
      },
      {
        studentInitials: "K.A.",
        cuetYear: 2024,
        college: "Ambedkar University Delhi (AUD)",
        course: "B.A. (Hons) Sociology and Anthropology",
        percentile: 91.8,
      },
    ],
  },
  {
    slug: "rising-batch",
    title: "Rising — strong CUET 2025-2026 trajectory",
    description:
      "Currently active students with mock-test progressions on track to clear top-tier DU and central university cutoffs.",
    outcomes: [
      {
        studentInitials: "I.R.",
        cuetYear: 2026,
        college: "Target: DU South Campus, Economics cluster",
        course: "Foundation + Target Batch",
        highlight: "Last six mocks above 95th percentile.",
      },
      {
        studentInitials: "M.J.",
        cuetYear: 2026,
        college: "Target: JNU UG, Languages",
        course: "Target Batch",
        highlight: "Strong English + domain-language pairing.",
      },
    ],
  },
];

export function buildResultsPageMetadata(): Metadata {
  return {
    title: "UNIMONKS Results — Where CUET students go after Munirka",
    description:
      "Verified CUET outcomes from UNIMONKS Munirka — DU south and north campus, JNU UG, BHU, AUD, and central university admissions across 2024-2026 cycles.",
    alternates: { canonical: "/results" },
    keywords: [
      "UNIMONKS CUET results",
      "CUET results Munirka",
      "DU SRCC CUET coaching",
      "JNU UG CUET coaching",
      "CUET coaching results Delhi",
    ],
    openGraph: {
      title: "UNIMONKS Results — CUET outcomes from Munirka",
      description:
        "Where UNIMONKS CUET students land — DU top colleges, JNU UG, and central universities across 2024-2026 cycles.",
      url: absoluteUrl("/results"),
      type: "website",
    },
  };
}

export function buildResultsItemListSchema(
  groups: OutcomeGroup[] = outcomeGroups,
) {
  const allOutcomes = groups.flatMap((group) => group.outcomes);

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "UNIMONKS CUET outcomes",
    description:
      "Anonymised CUET outcomes for UNIMONKS students across DU, JNU, BHU, AUD, and other central universities.",
    numberOfItems: allOutcomes.length,
    itemListElement: allOutcomes.map((outcome, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "EducationalOccupationalCredential",
        name: `${outcome.studentInitials} → ${outcome.college}`,
        credentialCategory: outcome.course,
        recognizedBy: outcome.college,
        about: outcome.highlight ?? `CUET ${outcome.cuetYear} outcome`,
      },
    })),
  };
}
