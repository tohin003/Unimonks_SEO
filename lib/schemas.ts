import type { SiteSettings } from "@/lib/content/site";
import {
  absoluteUrl,
  siteConfig,
  type FaqItem,
  type Program,
} from "@/lib/site";

// @id anchors derived from the canonical site URL. We use siteConfig.siteUrl
// (which is sourced from NEXT_PUBLIC_SITE_URL at build time) rather than the
// editable DB value, so the @id stays stable even if the displayed Site URL
// in the admin is being edited.
export const ORG_ID = `${siteConfig.siteUrl}/#org`;
export const WEBSITE_ID = `${siteConfig.siteUrl}/#website`;
export const FOUNDER_ID = `${siteConfig.siteUrl}/#founder`;

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export function buildOrganizationSchema(settings: SiteSettings) {
  const sameAs = settings.sameAs.filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": ORG_ID,
    name: settings.name,
    alternateName: settings.shortName,
    url: settings.siteUrl,
    logo: absoluteUrl("/unimonks-logo.png"),
    image: absoluteUrl("/unimonks-logo.png"),
    description: settings.description,
    slogan: settings.tagline,
    email: settings.email,
    telephone: settings.phoneDisplay,
    foundingDate: settings.foundingDate,
    founder: { "@id": FOUNDER_ID },
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.addressLines[0],
      addressLocality: settings.addressLocality,
      addressRegion: settings.addressRegion,
      postalCode: settings.postalCode,
      addressCountry: settings.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: settings.geo.latitude,
      longitude: settings.geo.longitude,
    },
    areaServed: settings.areaServed,
    knowsAbout: settings.knowsAbout,
    ...(sameAs.length ? { sameAs } : {}),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "admissions",
      telephone: settings.phoneDisplay,
      email: settings.email,
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
  };
}

export function buildFounderSchema(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: settings.founder.name,
    jobTitle: settings.founder.role,
    worksFor: { "@id": ORG_ID },
  };
}

export function buildWebSiteSchema(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: settings.siteUrl,
    name: settings.name,
    description: settings.description,
    inLanguage: "en-IN",
    publisher: { "@id": ORG_ID },
  };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildFAQSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildCourseListSchema(
  items: Program[],
  organizationName: string = siteConfig.name,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${organizationName} Courses`,
    itemListElement: items.map((program, index) => ({
      "@type": "Course",
      position: index + 1,
      name: program.name,
      description: program.summary,
      provider: { "@id": ORG_ID },
    })),
  };
}
