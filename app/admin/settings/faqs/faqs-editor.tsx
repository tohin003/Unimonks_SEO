"use client";

import { useMemo, useState, useTransition } from "react";

import { RepeatableGroup } from "@/app/admin/_components/inputs/repeatable-group";
import { TextareaInput } from "@/app/admin/_components/inputs/textarea-input";
import { TextInput } from "@/app/admin/_components/inputs/text-input";
import { SavePanel } from "@/app/admin/_components/save-panel";
import { StatusBanner } from "@/app/admin/_components/status-banner";
import {
  updateHomeFaqsAction,
  type FaqInput,
} from "@/app/admin/_actions/faqs";

type EditorProps = {
  initialFaqs: FaqInput;
  dbConfigured: boolean;
};

type Status = {
  variant: "success" | "error" | "info" | "warning";
  message: string;
};

export function FaqsEditor({ initialFaqs, dbConfigured }: EditorProps) {
  const [faqs, setFaqs] = useState<FaqInput>(initialFaqs);
  const [saved, setSaved] = useState<FaqInput>(initialFaqs);
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
    () => JSON.stringify(faqs) !== JSON.stringify(saved),
    [faqs, saved],
  );

  function handleSave() {
    setStatus(null);
    startTransition(async () => {
      const result = await updateHomeFaqsAction(faqs);
      if (result.ok) {
        setSaved(faqs);
        setStatus({
          variant: "success",
          message: result.message ?? "Home FAQs saved.",
        });
      } else {
        setStatus({ variant: "error", message: result.message });
      }
    });
  }

  return (
    <div className="space-y-6">
      <RepeatableGroup<FaqInput[number]>
        label="Home FAQ"
        values={faqs}
        onChange={setFaqs}
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
              placeholder="What students often ask first…"
            />
            <TextareaInput
              label="Answer"
              value={value.answer}
              onChange={(answer) => onChange({ ...value, answer })}
              required
              rows={4}
              helpText="Lead with the direct answer in the first sentence — AI Overviews extract from the opening."
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
        onDiscard={() => setFaqs(saved)}
      />
    </div>
  );
}
