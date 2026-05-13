import type { Metadata, Viewport } from "next";

import { getSiteSettings } from "@/lib/content/site";
import { absoluteUrl, jsonLdString, siteConfig } from "@/lib/site";
import {
  buildFounderSchema,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "@/lib/schemas";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  keywords: [
    "UNIMONKS",
    "CUET coaching in Munirka",
    "CUET coaching in New Delhi",
    "CUET UG and PG",
    "DU admissions",
    "GT preparation",
    "English language preparation",
  ],
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: absoluteUrl("/unimonks-logo.png"),
        width: 200,
        height: 200,
        alt: `${siteConfig.name} logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [absoluteUrl("/unimonks-logo.png")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f5ef",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const siteGraph = {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationSchema(settings),
      buildFounderSchema(settings),
      buildWebSiteSchema(settings),
    ],
  };

  return (
    <html lang="en">
      <body className="font-body text-slate-900 antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdString(siteGraph),
          }}
        />
        {children}
      </body>
    </html>
  );
}
