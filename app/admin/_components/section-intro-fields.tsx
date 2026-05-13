"use client";

import { TextInput } from "@/app/admin/_components/inputs/text-input";
import { TextareaInput } from "@/app/admin/_components/inputs/textarea-input";

type SectionIntroValue = {
  eyebrow: string;
  headline: string;
  description: string;
};

type Props = {
  value: SectionIntroValue;
  onChange: (next: SectionIntroValue) => void;
};

export function SectionIntroFields({ value, onChange }: Props) {
  return (
    <div className="space-y-4">
      <TextInput
        label="Eyebrow"
        value={value.eyebrow}
        onChange={(eyebrow) => onChange({ ...value, eyebrow })}
        required
        helpText="Short uppercase chip above the headline."
      />
      <TextInput
        label="Headline"
        value={value.headline}
        onChange={(headline) => onChange({ ...value, headline })}
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
  );
}
