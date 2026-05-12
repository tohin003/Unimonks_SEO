import type { Metadata } from "next";

import { SectionPlaceholder } from "@/app/admin/_components/section-placeholder";

export const metadata: Metadata = { title: "About page" };

export default function AdminAboutPage() {
  return (
    <SectionPlaceholder
      eyebrow="Pages · About"
      title="Edit the About page."
      description="Founder story, four guiding commitments, and the contact CTA on /about."
      livePath="/about"
      fields={[
        { name: "Hero eyebrow + H1", description: "Page-level intro." },
        { name: "Hero subhead", description: "Paragraph below the H1." },
        { name: "Founded panel", description: "Founding year + short note." },
        {
          name: "Founder card",
          description: "Name, role, qualifications, photo, full bio paragraph.",
        },
        {
          name: "Commitments grid",
          description: "Four panel cards with title + body.",
        },
        {
          name: "Press strip",
          description: "Settings · Press mentions controls this list.",
        },
      ]}
    />
  );
}
