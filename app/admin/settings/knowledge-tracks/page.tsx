import type { Metadata } from "next";

import { SectionPlaceholder } from "@/app/admin/_components/section-placeholder";
import { knowledgeTracks } from "@/lib/site";

export const metadata: Metadata = { title: "Knowledge tracks" };

export default function AdminKnowledgeTracksSettings() {
  return (
    <SectionPlaceholder
      eyebrow="Settings · Knowledge tracks"
      title="Edit the topic tracks on the Hub + footer."
      description={`${knowledgeTracks.length} tracks shared between the /hub page and the site footer.`}
      fields={[
        { name: "Title", description: "Short topic label." },
        { name: "Description", description: "1-2 line description rendered next to the title." },
        { name: "Order", description: "Drag-and-drop reorder." },
      ]}
    />
  );
}
