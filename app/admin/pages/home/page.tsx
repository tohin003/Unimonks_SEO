import type { Metadata } from "next";

import { getHomeContent } from "@/lib/content/home";
import { isDbConfigured } from "@/lib/db/client";

import { HomeEditor } from "./home-editor";

export const metadata: Metadata = { title: "Home page" };

export default async function AdminHomeContentPage() {
  const content = await getHomeContent();

  return (
    <div className="space-y-6">
      <header>
        <span className="eyebrow">Pages · Home</span>
        <h1 className="mt-5 font-headline text-4xl leading-tight text-primary md:text-5xl">
          Edit the home page sections.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          Hero subhead, proof points, section intros, lead-form copy, and
          contact intro. The programs grid + knowledge tracks + FAQ items
          themselves are edited in the dedicated Settings editors.
        </p>
      </header>
      <HomeEditor initial={content} dbConfigured={isDbConfigured()} />
    </div>
  );
}
