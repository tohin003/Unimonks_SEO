"use client";

import { useMemo, useState, useTransition } from "react";

import { ListInput } from "@/app/admin/_components/inputs/list-input";
import { TextInput } from "@/app/admin/_components/inputs/text-input";
import { TextareaInput } from "@/app/admin/_components/inputs/textarea-input";
import { SavePanel } from "@/app/admin/_components/save-panel";
import { StatusBanner } from "@/app/admin/_components/status-banner";
import {
  updateSiteSettingsAction,
  type SiteSettingsInput,
} from "@/app/admin/_actions/site-settings";

type EditorProps = {
  initial: SiteSettingsInput;
  dbConfigured: boolean;
};

type Status = {
  variant: "success" | "error" | "info" | "warning";
  message: string;
};

function Panel({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="panel space-y-5 p-6 md:p-7">
      <header>
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="mt-3 font-headline text-2xl leading-tight text-primary md:text-3xl">
          {title}
        </h2>
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function SiteSettingsEditor({ initial, dbConfigured }: EditorProps) {
  const [form, setForm] = useState<SiteSettingsInput>(initial);
  const [saved, setSaved] = useState<SiteSettingsInput>(initial);
  const [status, setStatus] = useState<Status | null>(
    dbConfigured
      ? null
      : {
          variant: "warning",
          message:
            "DATABASE_URL is not configured. Save is disabled until Neon is provisioned.",
        },
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const dirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(saved),
    [form, saved],
  );

  function setField<K extends keyof SiteSettingsInput>(
    key: K,
    value: SiteSettingsInput[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSave() {
    setStatus(null);
    setFieldErrors({});
    startTransition(async () => {
      const result = await updateSiteSettingsAction(form);
      if (result.ok) {
        setSaved(form);
        setStatus({
          variant: "success",
          message: result.message ?? "Site settings saved.",
        });
      } else {
        setStatus({ variant: "error", message: result.message });
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      }
    });
  }

  return (
    <div className="space-y-6">
      <Panel eyebrow="Identity" title="Brand name, title, description">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="Name"
            value={form.name}
            onChange={(value) => setField("name", value)}
            required
            error={fieldErrors.name}
          />
          <TextInput
            label="Short name"
            value={form.shortName}
            onChange={(value) => setField("shortName", value)}
            required
            error={fieldErrors.shortName}
            helpText="Used in header chip and SEO snippets."
          />
        </div>
        <TextInput
          label="Default <title>"
          value={form.title}
          onChange={(value) => setField("title", value)}
          required
          error={fieldErrors.title}
          helpText="Used as the page-title template default."
        />
        <TextareaInput
          label="Default meta description"
          value={form.description}
          onChange={(value) => setField("description", value)}
          required
          rows={3}
          error={fieldErrors.description}
        />
        <TextInput
          label="Tagline"
          value={form.tagline}
          onChange={(value) => setField("tagline", value)}
          error={fieldErrors.tagline}
          helpText="Optional — shown beside the logo."
        />
        <TextInput
          label="Hero eyebrow label"
          value={form.heroLabel}
          onChange={(value) => setField("heroLabel", value)}
          required
          error={fieldErrors.heroLabel}
          helpText='Top-of-home eyebrow chip. Example: "CUET coaching in Munirka, New Delhi"'
        />
      </Panel>

      <Panel eyebrow="Contact" title="Phone, email, WhatsApp">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="Phone (display)"
            value={form.phoneDisplay}
            onChange={(value) => setField("phoneDisplay", value)}
            required
            error={fieldErrors.phoneDisplay}
            placeholder="+91 99106 14532"
          />
          <TextInput
            label="Phone (tel: href)"
            value={form.phoneHref}
            onChange={(value) => setField("phoneHref", value)}
            required
            type="tel"
            error={fieldErrors.phoneHref}
            placeholder="tel:+919910614532"
          />
          <TextInput
            label="Email"
            value={form.email}
            onChange={(value) => setField("email", value)}
            required
            type="email"
            error={fieldErrors.email}
          />
          <TextInput
            label="WhatsApp link"
            value={form.whatsappHref}
            onChange={(value) => setField("whatsappHref", value)}
            required
            type="url"
            error={fieldErrors.whatsappHref}
            placeholder="https://wa.me/919910614532"
          />
        </div>
        <TextInput
          label="Site URL"
          value={form.siteUrl}
          onChange={(value) => setField("siteUrl", value)}
          required
          type="url"
          error={fieldErrors.siteUrl}
          helpText="Canonical production URL. JSON-LD references use this."
        />
      </Panel>

      <Panel eyebrow="Address" title="Postal address (NAP)">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="Address line 1"
            value={form.addressLine1}
            onChange={(value) => setField("addressLine1", value)}
            required
            error={fieldErrors.addressLine1}
          />
          <TextInput
            label="Address line 2"
            value={form.addressLine2}
            onChange={(value) => setField("addressLine2", value)}
            required
            error={fieldErrors.addressLine2}
          />
          <TextInput
            label="Locality"
            value={form.addressLocality}
            onChange={(value) => setField("addressLocality", value)}
            required
            error={fieldErrors.addressLocality}
          />
          <TextInput
            label="Region"
            value={form.addressRegion}
            onChange={(value) => setField("addressRegion", value)}
            required
            error={fieldErrors.addressRegion}
          />
          <TextInput
            label="Postal code"
            value={form.postalCode}
            onChange={(value) => setField("postalCode", value)}
            required
            error={fieldErrors.postalCode}
          />
          <TextInput
            label="Country (ISO)"
            value={form.addressCountry}
            onChange={(value) => setField("addressCountry", value)}
            required
            error={fieldErrors.addressCountry}
            helpText='Two-letter code, e.g. "IN"'
          />
        </div>
      </Panel>

      <Panel eyebrow="Geo" title="Map coordinates (for LocalBusiness schema)">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="Latitude"
            value={form.geoLatitude}
            onChange={(value) => setField("geoLatitude", value)}
            required
            error={fieldErrors.geoLatitude}
            placeholder="28.5535"
          />
          <TextInput
            label="Longitude"
            value={form.geoLongitude}
            onChange={(value) => setField("geoLongitude", value)}
            required
            error={fieldErrors.geoLongitude}
            placeholder="77.1739"
          />
        </div>
      </Panel>

      <Panel eyebrow="Founder" title="Founding date and founder profile">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="Founding year"
            value={form.foundingDate}
            onChange={(value) => setField("foundingDate", value)}
            required
            error={fieldErrors.foundingDate}
          />
          <TextInput
            label="Founder name"
            value={form.founderName}
            onChange={(value) => setField("founderName", value)}
            required
            error={fieldErrors.founderName}
          />
          <TextInput
            label="Founder role"
            value={form.founderRole}
            onChange={(value) => setField("founderRole", value)}
            required
            error={fieldErrors.founderRole}
          />
        </div>
      </Panel>

      <Panel eyebrow="Reach" title="Areas served, expertise, social links">
        <ListInput
          label="Areas served"
          values={[...form.areaServed]}
          onChange={(values) => setField("areaServed", values)}
          itemLabel="Area"
          placeholder="e.g. Vasant Kunj"
          helpText="Localities surfaced in JSON-LD areaServed."
        />
        <ListInput
          label="Knows about"
          values={[...form.knowsAbout]}
          onChange={(values) => setField("knowsAbout", values)}
          itemLabel="Topic"
          placeholder="e.g. CUET English language preparation"
          helpText="Subjects and services surfaced in JSON-LD knowsAbout."
        />
        <ListInput
          label="Social profile URLs (sameAs)"
          values={[...form.sameAs]}
          onChange={(values) => setField("sameAs", values)}
          itemLabel="Social link"
          placeholder="https://..."
          helpText="Verified Facebook/Instagram/LinkedIn etc. profile URLs."
        />
      </Panel>

      {status ? (
        <StatusBanner variant={status.variant} message={status.message} />
      ) : null}

      <SavePanel
        isPending={isPending}
        dirty={dirty}
        onSave={handleSave}
        onDiscard={() => setForm(saved)}
      />
    </div>
  );
}
