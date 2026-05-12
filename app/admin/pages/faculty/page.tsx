import type { Metadata } from "next";

import { SectionPlaceholder } from "@/app/admin/_components/section-placeholder";
import { facultyClusters, featuredFaculty } from "@/lib/faculty";

export const metadata: Metadata = { title: "Faculty page" };

export default function AdminFacultyPage() {
  return (
    <SectionPlaceholder
      eyebrow="Pages · Faculty"
      title="Edit the Faculty page."
      description={`Hero copy, ${featuredFaculty.length} featured faculty member${featuredFaculty.length === 1 ? "" : "s"} with full bios, and ${facultyClusters.length} subject-cluster cards.`}
      livePath="/faculty"
      fields={[
        { name: "Hero eyebrow + H1", description: "Page intro." },
        { name: "Hero subhead", description: "Paragraph describing the roster." },
        {
          name: "Faculty members (featured)",
          description: "Add / edit / re-order full faculty bios with portrait.",
        },
        {
          name: "Subject cluster cards",
          description: "GT, English, Psychology, Commerce, Humanities, Counseling.",
        },
        {
          name: "Press strip",
          description: "Same press mentions list shared across the site.",
        },
      ]}
    />
  );
}
