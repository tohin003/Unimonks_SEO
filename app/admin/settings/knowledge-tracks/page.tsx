import type { Metadata } from "next";

import { getKnowledgeTracks } from "@/lib/content/knowledge-tracks";
import { isDbConfigured } from "@/lib/db/client";

import { KnowledgeTracksEditor } from "./knowledge-tracks-editor";

export const metadata: Metadata = { title: "Knowledge tracks" };

export default async function AdminKnowledgeTracksSettings() {
  const tracks = await getKnowledgeTracks();
  return (
    <div className="space-y-6">
      <header>
        <span className="eyebrow">Settings · Knowledge tracks</span>
        <h1 className="mt-5 font-headline text-4xl leading-tight text-primary md:text-5xl">
          Edit the topic tracks on the Hub and footer.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          These tracks appear on the /hub page and in the site footer. Saving
          revalidates both.
        </p>
      </header>
      <KnowledgeTracksEditor
        initialTracks={tracks}
        dbConfigured={isDbConfigured()}
      />
    </div>
  );
}
