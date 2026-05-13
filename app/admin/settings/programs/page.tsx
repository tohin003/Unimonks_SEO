import type { Metadata } from "next";

import { isDbConfigured } from "@/lib/db/client";
import { getPrograms } from "@/lib/content/programs";

import { ProgramsEditor } from "./programs-editor";

export const metadata: Metadata = { title: "Programs" };

export default async function AdminProgramsSettings() {
  const programs = await getPrograms();

  return (
    <div className="space-y-6">
      <header>
        <span className="eyebrow">Settings · Programs</span>
        <h1 className="mt-5 font-headline text-4xl leading-tight text-primary md:text-5xl">
          Manage the coaching programs.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          These programs (Foundation, Target, Admissions desk) appear on the
          home page, the enroll page, and every location page. Saving here
          revalidates all of those routes within a few seconds.
        </p>
      </header>

      <ProgramsEditor
        initialPrograms={programs}
        dbConfigured={isDbConfigured()}
      />
    </div>
  );
}
