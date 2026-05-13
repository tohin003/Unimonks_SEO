import type { Metadata } from "next";

import { getFaqItems } from "@/lib/content/faqs";
import { isDbConfigured } from "@/lib/db/client";

import { FaqsEditor } from "./faqs-editor";

export const metadata: Metadata = { title: "FAQs" };

export default async function AdminFaqsSettings() {
  const faqs = await getFaqItems("home");

  return (
    <div className="space-y-6">
      <header>
        <span className="eyebrow">Settings · FAQs</span>
        <h1 className="mt-5 font-headline text-4xl leading-tight text-primary md:text-5xl">
          Edit the home page FAQ block.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          Each question appears on the home page and inside the FAQPage JSON-LD
          that AI Overviews extract from. Per-location FAQs are edited inside
          each Location editor.
        </p>
      </header>
      <FaqsEditor initialFaqs={faqs} dbConfigured={isDbConfigured()} />
    </div>
  );
}
