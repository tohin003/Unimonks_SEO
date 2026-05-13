"use client";

import { useMemo, useState, useTransition } from "react";

import { RepeatableGroup } from "@/app/admin/_components/inputs/repeatable-group";
import { TextInput } from "@/app/admin/_components/inputs/text-input";
import { TextareaInput } from "@/app/admin/_components/inputs/textarea-input";
import { SavePanel } from "@/app/admin/_components/save-panel";
import { StatusBanner } from "@/app/admin/_components/status-banner";
import {
  updateResultsAction,
  type ResultsInput,
} from "@/app/admin/_actions/results";

type EditorProps = {
  initial: ResultsInput;
  dbConfigured: boolean;
};

type Status = {
  variant: "success" | "error" | "info" | "warning";
  message: string;
};

export function ResultsEditor({ initial, dbConfigured }: EditorProps) {
  const [groups, setGroups] = useState<ResultsInput>(initial);
  const [saved, setSaved] = useState<ResultsInput>(initial);
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
    () => JSON.stringify(groups) !== JSON.stringify(saved),
    [groups, saved],
  );

  function handleSave() {
    setStatus(null);
    startTransition(async () => {
      const result = await updateResultsAction(groups);
      if (result.ok) {
        setSaved(groups);
        setStatus({
          variant: "success",
          message: result.message ?? "Results saved.",
        });
      } else {
        setStatus({ variant: "error", message: result.message });
      }
    });
  }

  return (
    <div className="space-y-6">
      <RepeatableGroup<ResultsInput[number]>
        label="Outcome groups"
        values={groups}
        onChange={setGroups}
        createNew={() => ({
          slug: "",
          title: "",
          description: "",
          outcomes: [],
        })}
        itemLabel="Group"
        itemSummary={(g) => g.title || g.slug || "Untitled group"}
        renderItem={({ value, onChange }) => (
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput
                label="Slug"
                value={value.slug}
                onChange={(slug) => onChange({ ...value, slug })}
                required
                helpText="URL fragment + group identifier (auto-deduplicated)."
              />
              <TextInput
                label="Title"
                value={value.title}
                onChange={(title) => onChange({ ...value, title })}
                required
              />
            </div>
            <TextareaInput
              label="Description"
              value={value.description}
              onChange={(description) =>
                onChange({ ...value, description })
              }
              required
              rows={3}
            />
            <RepeatableGroup<ResultsInput[number]["outcomes"][number]>
              label="Outcomes in this group"
              values={value.outcomes}
              onChange={(outcomes) => onChange({ ...value, outcomes })}
              createNew={() => ({
                studentInitials: "",
                cuetYear: new Date().getFullYear(),
                college: "",
                course: "",
                percentile: undefined,
                highlight: "",
                verified: false,
              })}
              itemLabel="Outcome"
              itemSummary={(outcome) =>
                `${outcome.studentInitials || "?"} → ${
                  outcome.college || "?"
                }`
              }
              renderItem={({ value: outcome, onChange: onOutcomeChange }) => (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <TextInput
                      label="Initials"
                      value={outcome.studentInitials}
                      onChange={(studentInitials) =>
                        onOutcomeChange({ ...outcome, studentInitials })
                      }
                      required
                      placeholder="A.K."
                    />
                    <TextInput
                      label="CUET year"
                      value={String(outcome.cuetYear)}
                      onChange={(v) =>
                        onOutcomeChange({
                          ...outcome,
                          cuetYear: Number(v) || outcome.cuetYear,
                        })
                      }
                      required
                      type="number"
                    />
                    <TextInput
                      label="Percentile (optional)"
                      value={
                        outcome.percentile != null
                          ? String(outcome.percentile)
                          : ""
                      }
                      onChange={(v) =>
                        onOutcomeChange({
                          ...outcome,
                          percentile:
                            v === "" || Number.isNaN(Number(v))
                              ? undefined
                              : Number(v),
                        })
                      }
                      type="number"
                      placeholder="98.6"
                    />
                  </div>
                  <TextInput
                    label="College"
                    value={outcome.college}
                    onChange={(college) =>
                      onOutcomeChange({ ...outcome, college })
                    }
                    required
                  />
                  <TextInput
                    label="Course"
                    value={outcome.course}
                    onChange={(course) =>
                      onOutcomeChange({ ...outcome, course })
                    }
                    required
                  />
                  <TextareaInput
                    label="Highlight (optional)"
                    value={outcome.highlight ?? ""}
                    onChange={(highlight) =>
                      onOutcomeChange({ ...outcome, highlight })
                    }
                    rows={2}
                  />
                  <label className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={!!outcome.verified}
                      onChange={(event) =>
                        onOutcomeChange({
                          ...outcome,
                          verified: event.target.checked,
                        })
                      }
                      className="mt-1 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <span>
                      Verified outcome — set this once student consent is on
                      file. Unverified outcomes still render but represent the
                      cohort, not a specific named admission.
                    </span>
                  </label>
                </div>
              )}
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
        onDiscard={() => setGroups(saved)}
      />
    </div>
  );
}
