import Image from "next/image";
import Link from "next/link";

import type { ShowcaseSlide } from "@/lib/content/showcase";
import { jsonLdString, siteConfig } from "@/lib/site";

type ImageShowcaseProps = {
  slides: ShowcaseSlide[];
  eyebrow?: string;
  headline?: string;
  description?: string;
};

function buildItemListSchema(slides: ShowcaseSlide[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${siteConfig.name} image showcase`,
    itemListElement: slides.map((slide, index) => ({
      "@type": "ImageObject",
      position: index + 1,
      contentUrl: slide.publicUrl.startsWith("http")
        ? slide.publicUrl
        : `${siteConfig.siteUrl}${slide.publicUrl}`,
      caption: slide.headline,
      description: slide.subhead ?? undefined,
      width: slide.width,
      height: slide.height,
    })),
  };
}

function SlideCard({
  slide,
  priority,
}: {
  slide: ShowcaseSlide;
  priority: boolean;
}) {
  const body = (
    <>
      <Image
        src={slide.publicUrl}
        alt={slide.alt || slide.headline}
        width={slide.width}
        height={slide.height}
        sizes="(max-width: 768px) 80vw, (max-width: 1280px) 40vw, 360px"
        priority={priority}
        className="h-full w-full object-cover transition duration-500 group-hover:saturate-110"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-primary/90 via-primary/60 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 p-5 text-on-primary">
        <p className="font-headline text-lg leading-tight tracking-tight md:text-xl">
          {slide.headline}
        </p>
        {slide.subhead ? (
          <p className="mt-1 text-sm leading-6 text-on-primary/85">
            {slide.subhead}
          </p>
        ) : null}
      </div>
    </>
  );

  const containerClass =
    "group relative block w-[78vw] max-w-[320px] shrink-0 snap-start overflow-hidden rounded-[28px] panel shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";

  // Reserve the 4:5 aspect ratio at the card level so the scrim + image stack
  // never shifts layout while the image is loading (CLS = 0).
  const aspectClass = "aspect-[4/5]";

  if (slide.linkUrl) {
    const isInternal = slide.linkUrl.startsWith("/");
    if (isInternal) {
      return (
        <Link href={slide.linkUrl} className={`${containerClass} ${aspectClass}`}>
          {body}
        </Link>
      );
    }
    return (
      <a
        href={slide.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${containerClass} ${aspectClass}`}
      >
        {body}
      </a>
    );
  }

  return (
    <div className={`${containerClass} ${aspectClass}`}>{body}</div>
  );
}

/**
 * Public image-showcase carousel. Renders nothing when there are no
 * enabled slides; emits ImageGallery JSON-LD when 3+ slides exist. The
 * row is a CSS scroll-snap horizontal scroller — no JS, no carousel
 * library, no layout shift. The first three images carry `priority` so
 * they are eligible for LCP.
 */
export function ImageShowcase({
  slides,
  eyebrow = "Inside UNIMONKS",
  headline = "A look at the work happening on the floor.",
  description,
}: ImageShowcaseProps) {
  if (slides.length === 0) return null;

  return (
    <section className="section-shell relative py-8 md:py-14" id="showcase">
      {slides.length >= 3 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdString(buildItemListSchema(slides)),
          }}
        />
      ) : null}
      <div className="panel p-6 md:p-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2 className="mt-5 section-title">{headline}</h2>
            {description ? (
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                {description}
              </p>
            ) : null}
          </div>
          {slides.length > 2 ? (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Scroll →
            </p>
          ) : null}
        </div>
        <div
          className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:thin] md:gap-5"
          role="list"
          aria-label="Image showcase"
        >
          {slides.map((slide, index) => (
            <div role="listitem" key={slide.id} className="contents">
              <SlideCard slide={slide} priority={index < 3} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
