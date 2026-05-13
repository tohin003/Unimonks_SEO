import type { Metadata } from "next";

import { getAboutContent } from "@/lib/content/about";
import { isDbConfigured } from "@/lib/db/client";

import { AboutEditor } from "./about-editor";

export const metadata: Metadata = { title: "About page" };

export default async function AdminAboutContentPage() {
  const content = await getAboutContent();

  return (
    <div className="space-y-6">
      <header>
        <span className="eyebrow">Pages · About</span>
        <h1 className="mt-5 font-headline text-4xl leading-tight text-primary md:text-5xl">
          Edit the About page sections.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          Hero, founded + what-we-run panels, founder section intro, four
          commitments, and visit intro. The press strip pulls from Settings ·
          Press; the founder card pulls from Pages · Faculty.
        </p>
      </header>
      <AboutEditor initial={content} dbConfigured={isDbConfigured()} />
    </div>
  );
}
