import type { Metadata } from "next";

import { SectionPlaceholder } from "@/app/admin/_components/section-placeholder";
import { faqItems, programs, siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Home page" };

export default function AdminHomePage() {
  return (
    <SectionPlaceholder
      eyebrow="Pages · Home"
      title="Edit the home page."
      description="Every editable surface on the / route — hero, proof points, programs intro, knowledge tracks, FAQ block, and contact section."
      livePath="/"
      fields={[
        {
          name: "Hero eyebrow + headline",
          description: "The short label above the H1 and the main H1 copy.",
          sample: `${siteConfig.heroLabel} → ${siteConfig.title}`,
        },
        {
          name: "Hero subhead",
          description: "Paragraph beneath the H1 introducing the centre.",
        },
        {
          name: "Hero image",
          description: "Optional 16:9 image rendered beside the hero copy.",
        },
        {
          name: "Three proof points",
          description: "Repeatable cards beneath the hero (title + body).",
        },
        {
          name: "Programs intro",
          description: "Eyebrow + headline + description above the programs grid.",
        },
        {
          name: "Programs",
          description: `Re-orderable list of ${programs.length} programs (Foundation, Target, Admissions).`,
        },
        {
          name: "FAQ block",
          description: `Re-orderable list of ${faqItems.length} questions and answers.`,
        },
      ]}
    />
  );
}
