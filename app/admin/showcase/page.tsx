import type { Metadata } from "next";

import { SectionPlaceholder } from "@/app/admin/_components/section-placeholder";

export const metadata: Metadata = { title: "Image showcase" };

export default function AdminShowcasePage() {
  return (
    <SectionPlaceholder
      eyebrow="Content · Image showcase"
      title="Curate the sliding image cards on the home page."
      description="A horizontal carousel of brand insights — each card pairs an image with a short headline and optional subhead/link. Re-orderable, enable/disable per slide."
      livePath="/"
      fields={[
        {
          name: "Slide image",
          description: "4:5 portrait or 3:4 — chosen at slide level.",
        },
        {
          name: "Headline overlay",
          description: "Short copy rendered over the image bottom 38%.",
        },
        {
          name: "Optional subhead",
          description: "One line of supporting context.",
        },
        {
          name: "Optional link URL",
          description: "Where the card sends visitors when clicked.",
        },
        {
          name: "Enable / disable",
          description: "Soft-hide a slide without deleting it.",
        },
        {
          name: "Order",
          description: "Drag-and-drop reorder; saved instantly.",
        },
      ]}
    />
  );
}
