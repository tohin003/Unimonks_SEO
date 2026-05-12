import type { Metadata } from "next";

import { SectionPlaceholder } from "@/app/admin/_components/section-placeholder";
import { pressMentions } from "@/lib/press";

export const metadata: Metadata = { title: "Press mentions" };

export default function AdminPressSettings() {
  return (
    <SectionPlaceholder
      eyebrow="Settings · Press"
      title="Edit the press strip."
      description={`The ${pressMentions.length} press logos rendered on home, About, Faculty, and Results pages.`}
      fields={[
        {
          name: "Publication",
          description: "Brand name of the publication (used as label).",
        },
        {
          name: "Article URL (optional)",
          description: "When set, the badge becomes a clickable link.",
        },
        {
          name: "Order",
          description: "Drag-and-drop reorder.",
        },
      ]}
    />
  );
}
