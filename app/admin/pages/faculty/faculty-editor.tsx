"use client";

import { useMemo, useState, useTransition } from "react";

import { ListInput } from "@/app/admin/_components/inputs/list-input";
import { RepeatableGroup } from "@/app/admin/_components/inputs/repeatable-group";
import { TextInput } from "@/app/admin/_components/inputs/text-input";
import { TextareaInput } from "@/app/admin/_components/inputs/textarea-input";
import { SavePanel } from "@/app/admin/_components/save-panel";
import { StatusBanner } from "@/app/admin/_components/status-banner";
import {
  updateFacultyAction,
  type FacultyInput,
} from "@/app/admin/_actions/faculty";

type EditorProps = {
  initial: FacultyInput;
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

export function FacultyEditor({ initial, dbConfigured }: EditorProps) {
  const [form, setForm] = useState<FacultyInput>(initial);
  const [saved, setSaved] = useState<FacultyInput>(initial);
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
      const result = await updateFacultyAction(form);
      if (result.ok) {
        setSaved(form);
        setStatus({
          variant: "success",
          message: result.message ?? "Faculty saved.",
        });
      } else {
        setStatus({ variant: "error", message: result.message });
      }
    });
  }

  return (
    <div className="space-y-6">
      <Panel
        eyebrow="Featured faculty"
        title="Named faculty members with full bios"
        description="Each featured member appears on /faculty with a full bio. The founder card on /about reads from this list too."
      >
        <RepeatableGroup<FacultyInput["featured"][number]>
          label="Featured faculty"
          values={form.featured}
          onChange={(featured) =>
            setForm((current) => ({ ...current, featured }))
          }
          createNew={() => ({
            name: "",
            honorific: "",
            role: "",
            qualifications: [],
            alma: [],
            subjects: [],
            bio: "",
          })}
          itemLabel="Member"
          itemSummary={(member) => member.name || "Untitled member"}
          renderItem={({ value, onChange }) => (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-[120px_minmax(0,1fr)]">
                <TextInput
                  label="Honorific"
                  value={value.honorific ?? ""}
                  onChange={(honorific) => onChange({ ...value, honorific })}
                  placeholder="Dr"
                  helpText="Optional"
                />
                <TextInput
                  label="Name"
                  value={value.name}
                  onChange={(name) => onChange({ ...value, name })}
                  required
                />
              </div>
              <TextInput
                label="Role"
                value={value.role}
                onChange={(role) => onChange({ ...value, role })}
                required
                placeholder="Founder & Academic Director"
              />
              <ListInput
                label="Qualifications"
                values={value.qualifications}
                onChange={(qualifications) =>
                  onChange({ ...value, qualifications })
                }
                itemLabel="Qualification"
                placeholder="PhD"
              />
              <ListInput
                label="Alma mater"
                values={value.alma}
                onChange={(alma) => onChange({ ...value, alma })}
                itemLabel="Institution"
                placeholder="Jawaharlal Nehru University"
              />
              <ListInput
                label="Subjects taught"
                values={value.subjects}
                onChange={(subjects) => onChange({ ...value, subjects })}
                itemLabel="Subject"
                placeholder="Academic strategy"
              />
              <TextareaInput
                label="Bio"
                value={value.bio}
                onChange={(bio) => onChange({ ...value, bio })}
                required
                rows={6}
                helpText="One paragraph. Surfaced verbatim on /faculty and /about."
              />
            </div>
          )}
        />
      </Panel>

      <Panel
        eyebrow="Subject clusters"
        title="Faculty grouped by subject area"
        description="Cluster cards on /faculty for areas where individual member profiles aren't yet published."
      >
        <RepeatableGroup<FacultyInput["clusters"][number]>
          label="Clusters"
          values={form.clusters}
          onChange={(clusters) =>
            setForm((current) => ({ ...current, clusters }))
          }
          createNew={() => ({
            area: "",
            description: "",
            affiliations: [],
            count: "",
          })}
          itemLabel="Cluster"
          itemSummary={(c) => c.area || "Untitled cluster"}
          renderItem={({ value, onChange }) => (
            <div className="space-y-4">
              <TextInput
                label="Subject area"
                value={value.area}
                onChange={(area) => onChange({ ...value, area })}
                required
              />
              <TextareaInput
                label="Description"
                value={value.description}
                onChange={(description) =>
                  onChange({ ...value, description })
                }
                required
                rows={3}
              />
              <TextInput
                label="Count label"
                value={value.count}
                onChange={(count) => onChange({ ...value, count })}
                required
                placeholder="3 specialists"
                helpText="Free-text — appears as the small uppercase chip on the card."
              />
              <ListInput
                label="Affiliations"
                values={value.affiliations}
                onChange={(affiliations) =>
                  onChange({ ...value, affiliations })
                }
                itemLabel="Affiliation"
                placeholder="JNU"
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
