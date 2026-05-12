import type { Metadata } from "next";

import { SectionPlaceholder } from "@/app/admin/_components/section-placeholder";
import { outcomeGroups } from "@/lib/results";

export const metadata: Metadata = { title: "Results page" };

export default function AdminResultsPage() {
  return (
    <SectionPlaceholder
      eyebrow="Pages · Results"
      title="Edit the Results page."
      description={`Hero, methodology panel, and ${outcomeGroups.length} outcome groups containing student admissions data.`}
      livePath="/results"
      fields={[
        { name: "Hero eyebrow + H1", description: "Page intro." },
        {
          name: "Verification banner",
          description: "Explains how outcomes are tracked and verified.",
        },
        {
          name: "Outcome groups",
          description:
            "DU top, Central universities + JNU UG, Rising cohort. Re-orderable.",
        },
        {
          name: "Student outcomes",
          description:
            "Per group: initials, year, college, course, percentile, optional highlight, verified flag.",
        },
        {
          name: "Methodology panel",
          description: "What gets counted vs what doesn't.",
        },
      ]}
    />
  );
}
