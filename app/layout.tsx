import type { Metadata, Viewport } from "next";

import { absoluteUrl, jsonLdString, siteConfig } from "@/lib/site";

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

const educationalOrganizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: siteConfig.name,
  url: siteConfig.siteUrl,
  logo: absoluteUrl("/unimonks-logo.png"),
  description: siteConfig.description,
  email: siteConfig.email,
  telephone: siteConfig.phoneDisplay,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.addressLines[0],
    addressLocality: "Munirka",
    addressRegion: "New Delhi",
    postalCode: "110067",
    addressCountry: "IN",
  },
  areaServed: ["Munirka", "New Delhi", "Delhi NCR"],
  knowsAbout: [
    "CUET UG preparation",
    "CUET PG preparation",
    "General Test preparation",
    "English language preparation",
    "University admissions guidance",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
            __html: jsonLdString(educationalOrganizationSchema),
          }}
        />
        {children}
      </body>
    </html>
  );
}
