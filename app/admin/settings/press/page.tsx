import type { Metadata } from "next";

import { getPressMentions } from "@/lib/content/press";
import { isDbConfigured } from "@/lib/db/client";

import { PressEditor } from "./press-editor";

export const metadata: Metadata = { title: "Press mentions" };

export default async function AdminPressSettings() {
  const mentions = await getPressMentions();

  return (
    <div className="space-y-6">
      <header>
        <span className="eyebrow">Settings · Press</span>
        <h1 className="mt-5 font-headline text-4xl leading-tight text-primary md:text-5xl">
          Edit the press strip.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          The press badges rendered on home, About, Faculty, and Results pages.
          Optional URLs make a badge clickable.
        </p>
      </header>
      <PressEditor initialMentions={mentions} dbConfigured={isDbConfigured()} />
    </div>
  );
}
