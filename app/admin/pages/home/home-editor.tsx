"use client";

import { useMemo, useState, useTransition } from "react";

import { RepeatableGroup } from "@/app/admin/_components/inputs/repeatable-group";
import { TextInput } from "@/app/admin/_components/inputs/text-input";
import { TextareaInput } from "@/app/admin/_components/inputs/textarea-input";
import { SavePanel } from "@/app/admin/_components/save-panel";
import { StatusBanner } from "@/app/admin/_components/status-banner";
import {
  updateHomeContentAction,
  type HomeContentInput,
} from "@/app/admin/_actions/home";

type EditorProps = {
  initial: HomeContentInput;
  dbConfigured: boolean;
};

type Status = {
  variant: "success" | "error" | "info" | "warning";
  message: string;
};

function Panel({
  eyebrow,
  title,
  id,
  children,
}: {
  eyebrow: string;
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="panel space-y-5 p-6 md:p-7">
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

function IntroFields({
  value,
  onChange,
  includeDescription = true,
}: {
  value: { eyebrow: string; headline: string; description?: string };
  onChange: (next: { eyebrow: string; headline: string; description?: string }) => void;
  includeDescription?: boolean;
}) {
  return (
    <div className="space-y-4">
      <TextInput
        label="Eyebrow"
        value={value.eyebrow}
        onChange={(eyebrow) => onChange({ ...value, eyebrow })}
        required
        helpText="Short uppercase label above the H2."
      />
      <TextInput
        label="Headline"
        value={value.headline}
        onChange={(headline) => onChange({ ...value, headline })}
        required
      />
      {includeDescription ? (
        <TextareaInput
          label="Description"
          value={value.description ?? ""}
          onChange={(description) => onChange({ ...value, description })}
          required
          rows={3}
        />
      ) : null}
    </div>
  );
}

export function HomeEditor({ initial, dbConfigured }: EditorProps) {
  const [form, setForm] = useState<HomeContentInput>(initial);
  const [saved, setSaved] = useState<HomeContentInput>(initial);
  const [status, setStatus] = useState<Status | null>(
    dbConfigured
      ? null
      : {
          variant: "warning",
          message:
            "DATABASE_URL is not configured. Save is disabled until Neon is provisioned.",
        },
  );
  const [isPending, startTransition] = useTransition();

  const dirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(saved),
    [form, saved],
  );

  function setField<K extends keyof HomeContentInput>(
    key: K,
    value: HomeContentInput[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSave() {
    setStatus(null);
    startTransition(async () => {
      const result = await updateHomeContentAction(form);
      if (result.ok) {
        setSaved(form);
        setStatus({
          variant: "success",
          message: result.message ?? "Home page saved.",
        });
      } else {
        setStatus({ variant: "error", message: result.message });
      }
    });
  }

  return (
    <div className="space-y-6">
      <Panel id="field-heroSubhead" eyebrow="Hero" title="Subhead paragraph beneath the H1">
        <TextareaInput
          label="Hero subhead"
          value={form.heroSubhead}
          onChange={(heroSubhead) => setField("heroSubhead", heroSubhead)}
          required
          rows={4}
          helpText="The hero eyebrow + H1 itself are edited in Site Settings (hero label). This is the paragraph beneath."
        />
      </Panel>

      <Panel id="field-proofPoints" eyebrow="Proof points" title="Three cards under the hero">
        <RepeatableGroup<HomeContentInput["proofPoints"][number]>
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

      <Panel id="field-programsIntro" eyebrow="Programs intro" title="Header strip above the programs grid">
        <IntroFields
          value={form.programsIntro}
          onChange={(programsIntro) =>
            setField("programsIntro", {
              ...form.programsIntro,
              ...programsIntro,
              description: programsIntro.description ?? "",
            })
          }
        />
      </Panel>

      <Panel
        eyebrow="Support steps"
        title='Header + three cards in the "Learn first, then take the next step" section'
      >
        <IntroFields
          value={form.supportSteps}
          onChange={(supportSteps) =>
            setField("supportSteps", {
              ...form.supportSteps,
              ...supportSteps,
              description: supportSteps.description ?? "",
            })
          }
        />
        <RepeatableGroup<HomeContentInput["supportSteps"]["items"][number]>
          label="Support steps"
          values={form.supportSteps.items}
          onChange={(items) =>
            setField("supportSteps", { ...form.supportSteps, items })
          }
          createNew={() => ({ title: "", body: "" })}
          itemLabel="Step"
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

      <Panel eyebrow="Articles intro" title="Header strip above the blog cards">
        <IntroFields
          value={{
            ...form.articlesIntro,
            description: "",
          }}
          onChange={(articlesIntro) =>
            setField("articlesIntro", {
              eyebrow: articlesIntro.eyebrow,
              headline: articlesIntro.headline,
            })
          }
          includeDescription={false}
        />
      </Panel>

      <Panel eyebrow="FAQ intro" title="Header strip above the FAQ block">
        <IntroFields
          value={form.faqIntro}
          onChange={(faqIntro) =>
            setField("faqIntro", {
              ...form.faqIntro,
              ...faqIntro,
              description: faqIntro.description ?? "",
            })
          }
        />
      </Panel>

      <Panel eyebrow="Contact intro" title="Header strip above the contact panel">
        <IntroFields
          value={form.contactIntro}
          onChange={(contactIntro) =>
            setField("contactIntro", {
              ...form.contactIntro,
              ...contactIntro,
              description: contactIntro.description ?? "",
            })
          }
        />
      </Panel>

      <Panel eyebrow="Lead form" title="Hero lead-form title + description">
        <div className="space-y-4">
          <TextInput
            label="Title"
            value={form.leadFormCopy.title}
            onChange={(title) =>
              setField("leadFormCopy", { ...form.leadFormCopy, title })
            }
            required
          />
          <TextareaInput
            label="Description"
            value={form.leadFormCopy.description}
            onChange={(description) =>
              setField("leadFormCopy", { ...form.leadFormCopy, description })
            }
            required
            rows={3}
          />
        </div>
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
