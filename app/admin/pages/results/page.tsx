import type { Metadata } from "next";

import type { ResultsInput } from "@/app/admin/_actions/results";
import { getOutcomeGroups } from "@/lib/content/results";
import { isDbConfigured } from "@/lib/db/client";

import { ResultsEditor } from "./results-editor";

export const metadata: Metadata = { title: "Results page" };

export default async function AdminResultsContentPage() {
  const groups = await getOutcomeGroups();

  const initial: ResultsInput = groups.map((group) => ({
    slug: group.slug,
    title: group.title,
    description: group.description,
    outcomes: group.outcomes.map((outcome) => ({
      studentInitials: outcome.studentInitials,
      cuetYear: outcome.cuetYear,
      college: outcome.college,
      course: outcome.course,
      percentile: outcome.percentile,
      highlight: outcome.highlight ?? "",
      verified: outcome.verified ?? false,
    })),
  }));

  return (
    <div className="space-y-6">
      <header>
        <span className="eyebrow">Pages · Results</span>
        <h1 className="mt-5 font-headline text-4xl leading-tight text-primary md:text-5xl">
          Edit the Results page outcomes.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          Each outcome group renders as a section on /results. Outcomes inside
          a group are re-orderable and individually marked as verified when
          student consent is on file.
        </p>
      </header>
      <ResultsEditor initial={initial} dbConfigured={isDbConfigured()} />
    </div>
  );
}
