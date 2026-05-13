import type { Metadata } from "next";

import { getSiteSettings } from "@/lib/content/site";
import { isDbConfigured } from "@/lib/db/client";

import { SiteSettingsEditor } from "./site-settings-editor";
import type { SiteSettingsInput } from "@/app/admin/_actions/site-settings";

export const metadata: Metadata = { title: "Site settings" };

export default async function AdminSiteSettingsPage() {
  const settings = await getSiteSettings();

  const initial: SiteSettingsInput = {
    name: settings.name,
    shortName: settings.shortName,
    title: settings.title,
    description: settings.description,
    tagline: settings.tagline,
    siteUrl: settings.siteUrl,
    phoneDisplay: settings.phoneDisplay,
    phoneHref: settings.phoneHref,
    email: settings.email,
    whatsappHref: settings.whatsappHref,
    addressLine1: settings.addressLines[0],
    addressLine2: settings.addressLines[1],
    postalCode: settings.postalCode,
    addressLocality: settings.addressLocality,
    addressRegion: settings.addressRegion,
    addressCountry: settings.addressCountry,
    geoLatitude: String(settings.geo.latitude),
    geoLongitude: String(settings.geo.longitude),
    heroLabel: settings.heroLabel,
    foundingDate: settings.foundingDate,
    founderName: settings.founder.name,
    founderRole: settings.founder.role,
    areaServed: [...settings.areaServed],
    knowsAbout: [...settings.knowsAbout],
    sameAs: [...settings.sameAs],
  };

  return (
    <div className="space-y-6">
      <header>
        <span className="eyebrow">Settings · Site</span>
        <h1 className="mt-5 font-headline text-4xl leading-tight text-primary md:text-5xl">
          Edit site-wide identity, NAP, and structured-data inputs.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          These values feed the layout JSON-LD graph, every page footer, the
          contact panels, and the sitemap. Saving here revalidates every
          public route.
        </p>
      </header>
      <SiteSettingsEditor initial={initial} dbConfigured={isDbConfigured()} />
    </div>
  );
}
