import type { Metadata } from "next";

import { SectionPlaceholder } from "@/app/admin/_components/section-placeholder";

export const metadata: Metadata = { title: "Enroll page" };

export default function AdminEnrollPage() {
  return (
    <SectionPlaceholder
      eyebrow="Pages · Enroll"
      title="Edit the Enroll page."
      description="Counseling-focused conversion page at /enroll."
      livePath="/enroll"
      fields={[
        { name: "Hero eyebrow + H1", description: "Page intro." },
        { name: "Hero subhead", description: "Paragraph beneath the H1." },
        {
          name: "Counseling points",
          description: "Three panel cards (Batch / Subject / Admissions).",
        },
        {
          name: "Dark contact card",
          description: "Address + phone + WhatsApp panel.",
        },
        {
          name: "Programs strip",
          description: "Re-uses the global programs list.",
        },
      ]}
    />
  );
}
