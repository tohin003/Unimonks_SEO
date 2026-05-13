"use client";

import { useMemo, useState, useTransition } from "react";

import { RepeatableGroup } from "@/app/admin/_components/inputs/repeatable-group";
import { TextInput } from "@/app/admin/_components/inputs/text-input";
import { TextareaInput } from "@/app/admin/_components/inputs/textarea-input";
import { SavePanel } from "@/app/admin/_components/save-panel";
import { StatusBanner } from "@/app/admin/_components/status-banner";
import {
  updateKnowledgeTracksAction,
  type KnowledgeTracksInput,
} from "@/app/admin/_actions/knowledge-tracks";

type EditorProps = {
  initialTracks: KnowledgeTracksInput;
  dbConfigured: boolean;
};

type Status = {
  variant: "success" | "error" | "info" | "warning";
  message: string;
};

export function KnowledgeTracksEditor({ initialTracks, dbConfigured }: EditorProps) {
  const [tracks, setTracks] = useState<KnowledgeTracksInput>(initialTracks);
  const [saved, setSaved] = useState<KnowledgeTracksInput>(initialTracks);
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
    () => JSON.stringify(tracks) !== JSON.stringify(saved),
    [tracks, saved],
  );

  function handleSave() {
    setStatus(null);
    startTransition(async () => {
      const result = await updateKnowledgeTracksAction(tracks);
      if (result.ok) {
        setSaved(tracks);
        setStatus({
          variant: "success",
          message: result.message ?? "Knowledge tracks saved.",
        });
      } else {
        setStatus({ variant: "error", message: result.message });
      }
    });
  }

  return (
    <div className="space-y-6">
      <RepeatableGroup<KnowledgeTracksInput[number]>
        label="Knowledge tracks"
        values={tracks}
        onChange={setTracks}
        createNew={() => ({ title: "", description: "" })}
        itemLabel="Track"
        itemSummary={(t) => t.title || "Untitled track"}
        renderItem={({ value, onChange }) => (
          <div className="space-y-4">
            <TextInput
              label="Title"
              value={value.title}
              onChange={(title) => onChange({ ...value, title })}
              required
              placeholder="e.g. General Test & Reasoning"
            />
            <TextareaInput
              label="Description"
              value={value.description}
              onChange={(description) => onChange({ ...value, description })}
              required
              rows={3}
              helpText="1-2 sentences shown on the Hub page and in the site footer."
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
        onDiscard={() => setTracks(saved)}
      />
    </div>
  );
}
