"use client";

import { useMemo, useState, useTransition } from "react";

import { AdminPanel } from "@/app/admin/_components/admin-panel";
import { SectionIntroFields } from "@/app/admin/_components/section-intro-fields";
import { TextInput } from "@/app/admin/_components/inputs/text-input";
import { TextareaInput } from "@/app/admin/_components/inputs/textarea-input";
import { SavePanel } from "@/app/admin/_components/save-panel";
import { StatusBanner } from "@/app/admin/_components/status-banner";
import {
  updateHubContentAction,
  type HubContentInput,
} from "@/app/admin/_actions/hub";

type Props = { initial: HubContentInput; dbConfigured: boolean };
type Status = {
  variant: "success" | "error" | "info" | "warning";
  message: string;
};

export function HubEditor({ initial, dbConfigured }: Props) {
  const [form, setForm] = useState<HubContentInput>(initial);
  const [saved, setSaved] = useState<HubContentInput>(initial);
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
      const result = await updateHubContentAction(form);
      if (result.ok) {
        setSaved(form);
        setStatus({
          variant: "success",
          message: result.message ?? "Hub page saved.",
        });
      } else {
        setStatus({ variant: "error", message: result.message });
      }
    });
  }

  return (
    <div className="space-y-6">
      <AdminPanel eyebrow="Hero" title="Hub page hero copy">
        <SectionIntroFields
          value={form.hero}
          onChange={(hero) => setForm((c) => ({ ...c, hero }))}
        />
      </AdminPanel>

      <AdminPanel
        eyebrow="How to use"
        title="Right-side panel above the article grid"
      >
        <SectionIntroFields
          value={form.howToUse}
          onChange={(howToUse) => setForm((c) => ({ ...c, howToUse }))}
        />
      </AdminPanel>

      <AdminPanel eyebrow="Lead form" title="Hub lead-form copy">
        <TextInput
          label="Title"
          value={form.leadFormCopy.title}
          onChange={(title) =>
            setForm((c) => ({
              ...c,
              leadFormCopy: { ...c.leadFormCopy, title },
            }))
          }
          required
        />
        <TextareaInput
          label="Description"
          value={form.leadFormCopy.description}
          onChange={(description) =>
            setForm((c) => ({
              ...c,
              leadFormCopy: { ...c.leadFormCopy, description },
            }))
          }
          required
          rows={3}
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
