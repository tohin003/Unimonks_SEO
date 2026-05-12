import type { Metadata } from "next";

import { SectionPlaceholder } from "@/app/admin/_components/section-placeholder";
import { faqItems } from "@/lib/site";

export const metadata: Metadata = { title: "FAQs" };

export default function AdminFaqSettings() {
  return (
    <SectionPlaceholder
      eyebrow="Settings · FAQs"
      title="Edit the global FAQ block."
      description={`The ${faqItems.length} questions on the home page FAQ block. Per-location FAQs are edited inside each Location editor.`}
      fields={[
        { name: "Question", description: "Question text rendered as H3." },
        { name: "Answer", description: "Answer paragraph rendered below." },
        { name: "Order", description: "Drag-and-drop reorder." },
      ]}
    />
  );
}
