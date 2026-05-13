import type { Metadata } from "next";

import { listMediaAssets } from "@/lib/content/media";
import { isDbConfigured } from "@/lib/db/client";
import { isProductionStorage } from "@/lib/storage";

import { MediaLibraryEditor } from "./media-library-editor";

export const metadata: Metadata = { title: "Media library" };

export default async function AdminMediaPage() {
  const assets = await listMediaAssets();
  const driver = isProductionStorage() ? "r2" : "local";
  const dbConfigured = isDbConfigured();

  return (
    <div className="space-y-6">
      <header>
        <span className="eyebrow">Content · Media</span>
        <h1 className="mt-5 font-headline text-4xl leading-tight text-primary md:text-5xl">
          Upload and manage every image on the site.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          Images uploaded here can be attached to the showcase, blog posts,
          faculty portraits, and any page hero. Storage driver:{" "}
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-xs text-slate-700">
            {driver === "r2" ? "Cloudflare R2" : "Local filesystem"}
          </span>
          .
        </p>
      </header>
      <MediaLibraryEditor
        initialAssets={assets}
        driver={driver}
        dbConfigured={dbConfigured}
      />
    </div>
  );
}
