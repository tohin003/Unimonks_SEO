"use client";

import { useMemo, useState, useTransition } from "react";

import { ListInput } from "@/app/admin/_components/inputs/list-input";
import { RepeatableGroup } from "@/app/admin/_components/inputs/repeatable-group";
import { TextInput } from "@/app/admin/_components/inputs/text-input";
import { TextareaInput } from "@/app/admin/_components/inputs/textarea-input";
import { SavePanel } from "@/app/admin/_components/save-panel";
import { StatusBanner } from "@/app/admin/_components/status-banner";
import {
  updateProgramsAction,
  type ProgramsInput,
} from "@/app/admin/_actions/programs";

type ProgramsEditorProps = {
  initialPrograms: ProgramsInput;
  dbConfigured: boolean;
};

type Status = { variant: "success" | "error" | "info" | "warning"; message: string };

function createEmptyProgram(): ProgramsInput[number] {
  return { name: "", summary: "", bullets: [] };
}

export function ProgramsEditor({
  initialPrograms,
  dbConfigured,
}: ProgramsEditorProps) {
  const [programs, setPrograms] = useState<ProgramsInput>(initialPrograms);
  const [savedSnapshot, setSavedSnapshot] = useState<ProgramsInput>(
    initialPrograms,
  );
  const [status, setStatus] = useState<Status | null>(
    dbConfigured
      ? null
      : {
          variant: "warning",
          message:
            "DATABASE_URL is not configured. You can browse the editor, but Save will not persist until Neon is provisioned.",
        },
  );
  const [isPending, startTransition] = useTransition();

  const dirty = useMemo(
    () => JSON.stringify(programs) !== JSON.stringify(savedSnapshot),
    [programs, savedSnapshot],
  );

  function handleSave() {
    setStatus(null);
    startTransition(async () => {
      const result = await updateProgramsAction(programs);
      if (result.ok) {
        setSavedSnapshot(programs);
        setStatus({
          variant: "success",
          message: result.message ?? "Programs saved.",
        });
      } else {
        setStatus({ variant: "error", message: result.message });
      }
    });
  }

  function handleDiscard() {
    setPrograms(savedSnapshot);
    setStatus(null);
  }

  return (
    <div className="space-y-6">
      <RepeatableGroup<ProgramsInput[number]>
        label="Programs"
        values={programs}
        onChange={setPrograms}
        createNew={createEmptyProgram}
        itemLabel="Program"
        itemSummary={(program) => program.name || "Untitled program"}
        renderItem={({ value, onChange }) => (
          <div className="space-y-4">
            <TextInput
              label="Name"
              value={value.name}
              onChange={(name) => onChange({ ...value, name })}
              required
              placeholder="e.g. CUET UG Foundation"
            />
            <TextareaInput
              label="Summary"
              value={value.summary}
              onChange={(summary) => onChange({ ...value, summary })}
              required
              rows={3}
              helpText="One short paragraph rendered under the program name."
            />
            <ListInput
              label="Bullets"
              values={value.bullets}
              onChange={(bullets) => onChange({ ...value, bullets })}
              itemLabel="Bullet"
              placeholder="A highlight of this program"
              helpText="Up to 20"
              emptyMessage="No bullets yet — add the first highlight of this program."
            />
          </div>
        )}
      />

      {status ? (
        <StatusBanner variant={status.variant} message={status.message} />
      ) : null}

      <SavePanel
        isPending={isPending}
        dirty={dirty}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />
    </div>
  );
}
