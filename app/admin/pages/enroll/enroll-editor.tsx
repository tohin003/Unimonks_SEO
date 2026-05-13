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
  updateEnrollContentAction,
  type EnrollContentInput,
} from "@/app/admin/_actions/enroll";

type Props = { initial: EnrollContentInput; dbConfigured: boolean };
type Status = {
  variant: "success" | "error" | "info" | "warning";
  message: string;
};

export function EnrollEditor({ initial, dbConfigured }: Props) {
  const [form, setForm] = useState<EnrollContentInput>(initial);
  const [saved, setSaved] = useState<EnrollContentInput>(initial);
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
      const result = await updateEnrollContentAction(form);
      if (result.ok) {
        setSaved(form);
        setStatus({
          variant: "success",
          message: result.message ?? "Enroll page saved.",
        });
      } else {
        setStatus({ variant: "error", message: result.message });
      }
    });
  }

  return (
    <div className="space-y-6">
      <AdminPanel eyebrow="Hero" title="Enroll page hero copy">
        <SectionIntroFields
          value={form.hero}
          onChange={(hero) => setForm((c) => ({ ...c, hero }))}
        />
      </AdminPanel>

      <AdminPanel
        eyebrow="Counseling points"
        title="Three panel cards under the hero"
      >
        <RepeatableGroup<EnrollContentInput["counselingPoints"][number]>
          label="Counseling points"
          values={form.counselingPoints}
          onChange={(counselingPoints) =>
            setForm((c) => ({ ...c, counselingPoints }))
          }
          createNew={() => ({ title: "", body: "" })}
          itemLabel="Point"
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
      </AdminPanel>

      <AdminPanel eyebrow="Lead form" title="Enroll-page lead-form copy">
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
