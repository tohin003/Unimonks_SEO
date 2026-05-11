import {
  absoluteUrl,
  faqItems as defaultFaqItems,
  programs,
  siteConfig,
  type FaqItem,
  type Program,
} from "@/lib/site";

export const ORG_ID = `${siteConfig.siteUrl}/#org`;
export const WEBSITE_ID = `${siteConfig.siteUrl}/#website`;
export const FOUNDER_ID = `${siteConfig.siteUrl}/#founder`;

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export function buildOrganizationSchema() {
  const sameAs = siteConfig.sameAs.filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": ORG_ID,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.siteUrl,
    logo: absoluteUrl("/unimonks-logo.png"),
    image: absoluteUrl("/unimonks-logo.png"),
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    email: siteConfig.email,
    telephone: siteConfig.phoneDisplay,
    foundingDate: siteConfig.foundingDate,
    founder: { "@id": FOUNDER_ID },
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.addressLines[0],
      addressLocality: siteConfig.addressLocality,
      addressRegion: siteConfig.addressRegion,
      postalCode: siteConfig.postalCode,
      addressCountry: siteConfig.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    areaServed: siteConfig.areaServed,
    knowsAbout: siteConfig.knowsAbout,
    ...(sameAs.length ? { sameAs } : {}),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "admissions",
      telephone: siteConfig.phoneDisplay,
      email: siteConfig.email,
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
  };
}

export function buildFounderSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: siteConfig.founder.name,
    jobTitle: siteConfig.founder.role,
    worksFor: { "@id": ORG_ID },
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: siteConfig.siteUrl,
    name: siteConfig.name,
    description: siteConfig.description,
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

export function buildFAQSchema(items: FaqItem[] = defaultFaqItems) {
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

export function buildCourseListSchema(items: Program[] = [...programs]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${siteConfig.name} Courses`,
    itemListElement: items.map((program, index) => ({
      "@type": "Course",
      position: index + 1,
      name: program.name,
      description: program.summary,
      provider: { "@id": ORG_ID },
    })),
  };
}
