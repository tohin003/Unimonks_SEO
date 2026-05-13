import type { Metadata } from "next";

import { getEnrollContent } from "@/lib/content/enroll";
import { isDbConfigured } from "@/lib/db/client";

import { EnrollEditor } from "./enroll-editor";

export const metadata: Metadata = { title: "Enroll page" };

export default async function AdminEnrollContentPage() {
  const content = await getEnrollContent();

  return (
    <div className="space-y-6">
      <header>
        <span className="eyebrow">Pages · Enroll</span>
        <h1 className="mt-5 font-headline text-4xl leading-tight text-primary md:text-5xl">
          Edit the Enroll page sections.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          Hero copy, counseling-point cards, and lead-form copy. The dark
          contact card pulls the address and phone from Site Settings.
        </p>
      </header>
      <EnrollEditor initial={content} dbConfigured={isDbConfigured()} />
    </div>
  );
}
