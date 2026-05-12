import type { Metadata } from "next";

import { SectionPlaceholder } from "@/app/admin/_components/section-placeholder";
import { programs } from "@/lib/site";

export const metadata: Metadata = { title: "Programs" };

export default function AdminProgramsSettings() {
  return (
    <SectionPlaceholder
      eyebrow="Settings · Programs"
      title="Manage the coaching programs."
      description={`The ${programs.length} programs (Foundation, Target, Admissions desk) shown on home, enroll, and every location page.`}
      fields={[
        { name: "Name", description: "Program title (becomes the heading on cards)." },
        { name: "Summary", description: "Short description rendered under the title." },
        { name: "Bullets", description: "Re-orderable highlights inside the card." },
        { name: "Order", description: "Drag-and-drop reorder; saved instantly." },
      ]}
    />
  );
}
