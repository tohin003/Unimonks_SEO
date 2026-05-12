import type { Metadata } from "next";

import { SectionPlaceholder } from "@/app/admin/_components/section-placeholder";
import { knowledgeTracks } from "@/lib/site";

export const metadata: Metadata = { title: "Knowledge Hub" };

export default function AdminHubPage() {
  return (
    <SectionPlaceholder
      eyebrow="Pages · Knowledge Hub"
      title="Edit the Knowledge Hub page."
      description={`Hero copy + the ${knowledgeTracks.length} topic tracks shown on /hub and in the footer.`}
      livePath="/hub"
      fields={[
        { name: "Hero eyebrow + H1", description: "Page intro." },
        { name: "Hero subhead", description: "Paragraph beneath the H1." },
        {
          name: "Knowledge tracks",
          description: "Settings · Knowledge tracks controls this list.",
        },
        {
          name: "How to use panel",
          description: "Right-side intro panel above the article grid.",
        },
        {
          name: "Lead form copy",
          description: "Title + description on the in-page LeadForm.",
        },
      ]}
    />
  );
}
