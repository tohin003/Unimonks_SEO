"use client";

import { useMemo, useState, useTransition } from "react";

import { RepeatableGroup } from "@/app/admin/_components/inputs/repeatable-group";
import { TextInput } from "@/app/admin/_components/inputs/text-input";
import { SavePanel } from "@/app/admin/_components/save-panel";
import { StatusBanner } from "@/app/admin/_components/status-banner";
import {
  updatePressMentionsAction,
  type PressMentionsInput,
} from "@/app/admin/_actions/press";

type EditorProps = {
  initialMentions: PressMentionsInput;
  dbConfigured: boolean;
};

type Status = {
  variant: "success" | "error" | "info" | "warning";
  message: string;
};

export function PressEditor({ initialMentions, dbConfigured }: EditorProps) {
  const [mentions, setMentions] = useState<PressMentionsInput>(initialMentions);
  const [saved, setSaved] = useState<PressMentionsInput>(initialMentions);
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
    () => JSON.stringify(mentions) !== JSON.stringify(saved),
    [mentions, saved],
  );

  function handleSave() {
    setStatus(null);
    startTransition(async () => {
      const result = await updatePressMentionsAction(mentions);
      if (result.ok) {
        setSaved(mentions);
        setStatus({
          variant: "success",
          message: result.message ?? "Press mentions saved.",
        });
      } else {
        setStatus({ variant: "error", message: result.message });
      }
    });
  }

  return (
    <div className="space-y-6">
      <RepeatableGroup<PressMentionsInput[number]>
        label="Press mentions"
        values={mentions}
        onChange={setMentions}
        createNew={() => ({ publication: "", url: "" })}
        itemLabel="Mention"
        itemSummary={(m) => m.publication || "Untitled mention"}
        renderItem={({ value, onChange }) => (
          <div className="space-y-4">
            <TextInput
              label="Publication"
              value={value.publication}
              onChange={(publication) => onChange({ ...value, publication })}
              required
              placeholder="e.g. The Times of India"
            />
            <TextInput
              label="Article URL (optional)"
              value={value.url ?? ""}
              onChange={(url) => onChange({ ...value, url })}
              type="url"
              placeholder="https://..."
              helpText="When set, the badge becomes a clickable link."
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
        onDiscard={() => setMentions(saved)}
      />
    </div>
  );
}
