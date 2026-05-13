import type { Metadata } from "next";

import { getHubContent } from "@/lib/content/hub";
import { isDbConfigured } from "@/lib/db/client";

import { HubEditor } from "./hub-editor";

export const metadata: Metadata = { title: "Knowledge Hub" };

export default async function AdminHubContentPage() {
  const content = await getHubContent();

  return (
    <div className="space-y-6">
      <header>
        <span className="eyebrow">Pages · Knowledge Hub</span>
        <h1 className="mt-5 font-headline text-4xl leading-tight text-primary md:text-5xl">
          Edit the Knowledge Hub page sections.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          Hero copy, how-to-use panel, and lead-form copy. Topic tracks are
          edited in Settings · Knowledge tracks.
        </p>
      </header>
      <HubEditor initial={content} dbConfigured={isDbConfigured()} />
    </div>
  );
}
