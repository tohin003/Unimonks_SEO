import type { Metadata } from "next";

import { SectionPlaceholder } from "@/app/admin/_components/section-placeholder";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Site settings" };

export default function AdminSiteSettings() {
  return (
    <SectionPlaceholder
      eyebrow="Settings · Site"
      title="Edit name, NAP, phone, email, social URLs."
      description="These values appear in the layout JSON-LD, every page footer, and on the contact section of every page."
      fields={[
        { name: "Brand name + short name", description: "UNIMONKS / UNIMONKS CUET", sample: `${siteConfig.name} · ${siteConfig.shortName}` },
        { name: "Title + description", description: "Default <title> template and meta description." },
        { name: "Tagline", description: "Used in hero label and other prominent spots." },
        { name: "Site URL", description: "Production domain used for canonicals.", sample: siteConfig.siteUrl },
        { name: "Phone (display + dial href)", description: "Visible number and tel: link." },
        { name: "Email", description: "Public contact email." },
        { name: "WhatsApp link", description: "wa.me URL." },
        { name: "Address lines", description: "Street + city/postcode lines." },
        { name: "Geo coordinates", description: "Used for LocalBusiness JSON-LD." },
        { name: "Founding date + founder", description: "Used by EducationalOrganization + Person schemas." },
        { name: "Area served list", description: "Localities the centre coaches for." },
        { name: "Knows about list", description: "Subjects + services in JSON-LD." },
        { name: "sameAs (social URLs)", description: "Verified social profile URLs." },
      ]}
    />
  );
}
