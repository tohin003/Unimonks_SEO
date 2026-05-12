import type { Metadata } from "next";

import { SectionPlaceholder } from "@/app/admin/_components/section-placeholder";
import { isProductionStorage } from "@/lib/storage";

export const metadata: Metadata = { title: "Media library" };

export default function AdminMediaPage() {
  const driver = isProductionStorage() ? "Cloudflare R2" : "Local filesystem";

  return (
    <SectionPlaceholder
      eyebrow="Content · Media"
      title="Upload and manage every image on the site."
      description={`Current storage driver: ${driver}. Images uploaded here can be attached to the showcase, blog posts, faculty portraits, and any page hero.`}
      fields={[
        {
          name: "Drag-drop upload",
          description: "Multiple files at once. Presigned PUT when in R2 mode.",
        },
        {
          name: "Alt text editor",
          description: "Per-asset accessible label (SEO-critical).",
        },
        {
          name: "Title + caption",
          description: "Optional metadata used for image:image sitemap entries.",
        },
        {
          name: "Usage backlinks",
          description: "See which pages, posts, and slides reference each image.",
        },
        {
          name: "Soft delete",
          description: "Hide unused assets; existing references stay alive.",
        },
        {
          name: "Filter",
          description: "By usage scope (unused, blog, showcase, faculty, hero).",
        },
      ]}
    />
  );
}
