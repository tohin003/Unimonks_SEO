"use client";

import { useMemo, useState, useTransition } from "react";

import { ListInput } from "@/app/admin/_components/inputs/list-input";
import { RepeatableGroup } from "@/app/admin/_components/inputs/repeatable-group";
import { TextInput } from "@/app/admin/_components/inputs/text-input";
import { TextareaInput } from "@/app/admin/_components/inputs/textarea-input";
import { SavePanel } from "@/app/admin/_components/save-panel";
import { StatusBanner } from "@/app/admin/_components/status-banner";
import {
  updateLocationAction,
  type LocationInput,
} from "@/app/admin/_actions/locations";

type EditorProps = {
  originalSlug: string;
  initial: LocationInput;
  dbConfigured: boolean;
};

type Status = {
  variant: "success" | "error" | "info" | "warning";
  message: string;
};

function Panel({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="panel space-y-5 p-6 md:p-7">
      <header>
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="mt-3 font-headline text-2xl leading-tight text-primary md:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
        ) : null}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function LocationEditor({
  originalSlug,
  initial,
  dbConfigured,
}: EditorProps) {
  const [form, setForm] = useState<LocationInput>(initial);
  const [saved, setSaved] = useState<LocationInput>(initial);
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

  function setField<K extends keyof LocationInput>(
    key: K,
    value: LocationInput[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSave() {
    setStatus(null);
    setFieldErrors({});
    startTransition(async () => {
      const result = await updateLocationAction(originalSlug, form);
      if (result.ok) {
        setSaved(form);
        setStatus({
          variant: "success",
          message: result.message ?? "Location saved.",
        });
      } else {
        setStatus({ variant: "error", message: result.message });
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      }
    });
  }

  return (
    <div className="space-y-6">
      <Panel
        eyebrow="Identity"
        title="Slug, area name, search query"
        description={`URL: /cuet-coaching-in-${form.slug}`}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="Slug"
            value={form.slug}
            onChange={(slug) => setField("slug", slug)}
            required
            error={fieldErrors.slug}
            helpText="Changing this redirects the old URL."
          />
          <TextInput
            label="Area"
            value={form.area}
            onChange={(area) => setField("area", area)}
            required
            error={fieldErrors.area}
          />
        </div>
        <TextInput
          label="Full name"
          value={form.fullName}
          onChange={(fullName) => setField("fullName", fullName)}
          required
          error={fieldErrors.fullName}
          helpText="Used in Place schema, e.g. 'Vasant Kunj, South Delhi'."
        />
        <TextInput
          label="Primary search query"
          value={form.searchQuery}
          onChange={(searchQuery) => setField("searchQuery", searchQuery)}
          required
          error={fieldErrors.searchQuery}
          helpText="Example: 'CUET coaching in Vasant Kunj'"
        />
      </Panel>

      <Panel eyebrow="SEO" title="Page meta title and description">
        <TextInput
          label="Meta title"
          value={form.metaTitle}
          onChange={(metaTitle) => setField("metaTitle", metaTitle)}
          required
          error={fieldErrors.metaTitle}
          helpText="Used as the <title> on this page."
        />
        <TextareaInput
          label="Meta description"
          value={form.metaDescription}
          onChange={(metaDescription) =>
            setField("metaDescription", metaDescription)
          }
          required
          rows={3}
          error={fieldErrors.metaDescription}
        />
      </Panel>

      <Panel eyebrow="Hero" title="Eyebrow chip, headline, and lead paragraph">
        <TextInput
          label="Hero eyebrow"
          value={form.heroEyebrow}
          onChange={(heroEyebrow) => setField("heroEyebrow", heroEyebrow)}
          required
          error={fieldErrors.heroEyebrow}
        />
        <TextareaInput
          label="Hero headline"
          value={form.heroHeadline}
          onChange={(heroHeadline) => setField("heroHeadline", heroHeadline)}
          required
          rows={3}
          error={fieldErrors.heroHeadline}
        />
        <TextareaInput
          label="Intro paragraph"
          value={form.intro}
          onChange={(intro) => setField("intro", intro)}
          required
          rows={6}
          error={fieldErrors.intro}
          helpText="Lead paragraph under the hero. Locality-specific."
        />
      </Panel>

      <Panel
        eyebrow="Commute"
        title="How students reach Munirka from this area"
      >
        <TextInput
          label="Commute heading"
          value={form.commuteHeading}
          onChange={(commuteHeading) =>
            setField("commuteHeading", commuteHeading)
          }
          required
          error={fieldErrors.commuteHeading}
        />
        <ListInput
          label="Commute paragraphs"
          values={[...form.commuteParagraphs]}
          onChange={(commuteParagraphs) =>
            setField("commuteParagraphs", commuteParagraphs)
          }
          itemLabel="Paragraph"
          multiline
          helpText="One paragraph per metro/road option."
        />
        <TextareaInput
          label="Metro note"
          value={form.metroNote}
          onChange={(metroNote) => setField("metroNote", metroNote)}
          required
          rows={3}
          error={fieldErrors.metroNote}
          helpText="One-line description rendered in the Metro callout card."
        />
        <TextareaInput
          label="Road note"
          value={form.driveNote}
          onChange={(driveNote) => setField("driveNote", driveNote)}
          required
          rows={3}
          error={fieldErrors.driveNote}
          helpText="One-line description rendered in the By-road callout card."
        />
      </Panel>

      <Panel
        eyebrow="Landmarks"
        title="Hyperlocal landmarks near the area"
      >
        <ListInput
          label="Landmarks"
          values={[...form.landmarks]}
          onChange={(landmarks) => setField("landmarks", landmarks)}
          itemLabel="Landmark"
          placeholder="e.g. Vasant Kunj Metro Station"
        />
      </Panel>

      <Panel
        eyebrow="Schools"
        title="Common feeder schools near the area"
      >
        <ListInput
          label="Feeder schools"
          values={[...form.schools]}
          onChange={(schools) => setField("schools", schools)}
          itemLabel="School"
          placeholder="e.g. Delhi Public School, Vasant Kunj"
        />
      </Panel>

      <Panel
        eyebrow="Why here"
        title="A single paragraph framing this catchment"
      >
        <TextareaInput
          label="Why here"
          value={form.whyHere}
          onChange={(whyHere) => setField("whyHere", whyHere)}
          required
          rows={4}
          error={fieldErrors.whyHere}
        />
      </Panel>

      <Panel
        eyebrow="Proof points"
        title="Three locality-specific cards under the hero"
      >
        <RepeatableGroup<LocationInput["proofPoints"][number]>
          label="Proof points"
          values={form.proofPoints}
          onChange={(proofPoints) => setField("proofPoints", proofPoints)}
          createNew={() => ({ title: "", body: "" })}
          itemLabel="Proof point"
          itemSummary={(p) => p.title || "Untitled"}
          renderItem={({ value, onChange }) => (
            <div className="space-y-4">
              <TextInput
                label="Title"
                value={value.title}
                onChange={(title) => onChange({ ...value, title })}
                required
              />
              <TextareaInput
                label="Body"
                value={value.body}
                onChange={(body) => onChange({ ...value, body })}
                required
                rows={3}
              />
            </div>
          )}
        />
      </Panel>

      <Panel
        eyebrow="Local FAQs"
        title="Three questions specific to this area"
      >
        <RepeatableGroup<LocationInput["localFaqs"][number]>
          label="Local FAQs"
          values={form.localFaqs}
          onChange={(localFaqs) => setField("localFaqs", localFaqs)}
          createNew={() => ({ question: "", answer: "" })}
          itemLabel="Question"
          itemSummary={(faq) => faq.question || "Untitled question"}
          renderItem={({ value, onChange }) => (
            <div className="space-y-4">
              <TextInput
                label="Question"
                value={value.question}
                onChange={(question) => onChange({ ...value, question })}
                required
              />
              <TextareaInput
                label="Answer"
                value={value.answer}
                onChange={(answer) => onChange({ ...value, answer })}
                required
                rows={4}
              />
            </div>
          )}
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
