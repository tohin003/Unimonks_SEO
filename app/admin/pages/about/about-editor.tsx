"use client";

import { useMemo, useState, useTransition } from "react";

import { AdminPanel } from "@/app/admin/_components/admin-panel";
import { SectionIntroFields } from "@/app/admin/_components/section-intro-fields";
import { RepeatableGroup } from "@/app/admin/_components/inputs/repeatable-group";
import { TextInput } from "@/app/admin/_components/inputs/text-input";
import { TextareaInput } from "@/app/admin/_components/inputs/textarea-input";
import { SavePanel } from "@/app/admin/_components/save-panel";
import { StatusBanner } from "@/app/admin/_components/status-banner";
import {
  updateAboutContentAction,
  type AboutContentInput,
} from "@/app/admin/_actions/about";

type Props = { initial: AboutContentInput; dbConfigured: boolean };
type Status = {
  variant: "success" | "error" | "info" | "warning";
  message: string;
};

export function AboutEditor({ initial, dbConfigured }: Props) {
  const [form, setForm] = useState<AboutContentInput>(initial);
  const [saved, setSaved] = useState<AboutContentInput>(initial);
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

  function handleSave() {
    setStatus(null);
    startTransition(async () => {
      const result = await updateAboutContentAction(form);
      if (result.ok) {
        setSaved(form);
        setStatus({
          variant: "success",
          message: result.message ?? "About page saved.",
        });
      } else {
        setStatus({ variant: "error", message: result.message });
      }
    });
  }

  return (
    <div className="space-y-6">
      <AdminPanel eyebrow="Hero" title="About page hero copy">
        <SectionIntroFields
          value={form.hero}
          onChange={(hero) => setForm((c) => ({ ...c, hero }))}
        />
      </AdminPanel>

      <AdminPanel
        eyebrow="Founded panel"
        title='Small "Founded" callout in the hero row'
        description="The year shown is sourced from Site Settings · Founder."
      >
        <TextInput
          label="Eyebrow"
          value={form.foundedPanel.eyebrow}
          onChange={(eyebrow) =>
            setForm((c) => ({
              ...c,
              foundedPanel: { ...c.foundedPanel, eyebrow },
            }))
          }
          required
        />
        <TextareaInput
          label="Description"
          value={form.foundedPanel.description}
          onChange={(description) =>
            setForm((c) => ({
              ...c,
              foundedPanel: { ...c.foundedPanel, description },
            }))
          }
          required
          rows={3}
        />
      </AdminPanel>

      <AdminPanel
        eyebrow="What-we-run panel"
        title='"Foundation · Target · Admissions" panel in the hero row'
      >
        <TextInput
          label="Eyebrow"
          value={form.whatWeRunPanel.eyebrow}
          onChange={(eyebrow) =>
            setForm((c) => ({
              ...c,
              whatWeRunPanel: { ...c.whatWeRunPanel, eyebrow },
            }))
          }
          required
        />
        <TextInput
          label="Title"
          value={form.whatWeRunPanel.title}
          onChange={(title) =>
            setForm((c) => ({
              ...c,
              whatWeRunPanel: { ...c.whatWeRunPanel, title },
            }))
          }
          required
        />
        <TextareaInput
          label="Description"
          value={form.whatWeRunPanel.description}
          onChange={(description) =>
            setForm((c) => ({
              ...c,
              whatWeRunPanel: { ...c.whatWeRunPanel, description },
            }))
          }
          required
          rows={3}
        />
      </AdminPanel>

      <AdminPanel
        eyebrow="Founder intro"
        title="Header strip above the founder card"
        description="The founder card itself is edited in Pages · Faculty."
      >
        <SectionIntroFields
          value={form.founderIntro}
          onChange={(founderIntro) => setForm((c) => ({ ...c, founderIntro }))}
        />
      </AdminPanel>

      <AdminPanel
        eyebrow="Commitments"
        title="Four panel cards beneath the founder section"
      >
        <RepeatableGroup<AboutContentInput["commitments"][number]>
          label="Commitments"
          values={form.commitments}
          onChange={(commitments) => setForm((c) => ({ ...c, commitments }))}
          createNew={() => ({ eyebrow: "", title: "", description: "" })}
          itemLabel="Commitment"
          itemSummary={(c) => c.title || c.eyebrow || "Untitled"}
          renderItem={({ value, onChange }) => (
            <div className="space-y-4">
              <TextInput
                label="Eyebrow"
                value={value.eyebrow}
                onChange={(eyebrow) => onChange({ ...value, eyebrow })}
                required
              />
              <TextInput
                label="Title"
                value={value.title}
                onChange={(title) => onChange({ ...value, title })}
                required
              />
              <TextareaInput
                label="Description"
                value={value.description}
                onChange={(description) => onChange({ ...value, description })}
                required
                rows={3}
              />
            </div>
          )}
        />
      </AdminPanel>

      <AdminPanel eyebrow="Visit intro" title="Header strip above the visit panel">
        <SectionIntroFields
          value={form.visitIntro}
          onChange={(visitIntro) => setForm((c) => ({ ...c, visitIntro }))}
        />
      </AdminPanel>

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
