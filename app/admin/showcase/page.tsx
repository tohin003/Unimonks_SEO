import type { Metadata } from "next";

import { listShowcaseSlides } from "@/lib/content/showcase";
import { isDbConfigured } from "@/lib/db/client";

import { ShowcaseEditor, type ShowcaseSlideForm } from "./showcase-editor";

export const metadata: Metadata = { title: "Image showcase" };

export default async function AdminShowcasePage() {
  const slides = await listShowcaseSlides();

  const initial: ShowcaseSlideForm[] = slides.map((slide) => ({
    assetId: slide.assetId,
    publicUrl: slide.publicUrl,
    alt: slide.alt,
    width: slide.width,
    height: slide.height,
    headline: slide.headline,
    subhead: slide.subhead ?? "",
    linkUrl: slide.linkUrl ?? "",
    enabled: slide.enabled,
  }));

  return (
    <div className="space-y-6">
      <header>
        <span className="eyebrow">Content · Image showcase</span>
        <h1 className="mt-5 font-headline text-4xl leading-tight text-primary md:text-5xl">
          Curate the sliding image cards on the home page.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          Each card pairs an image with a short headline and an optional
          subhead and link. Reorder with the arrow buttons; disable a slide
          to hide it from the live site without losing the content.
        </p>
      </header>
      <ShowcaseEditor
        initialSlides={initial}
        dbConfigured={isDbConfigured()}
      />
    </div>
  );
}
