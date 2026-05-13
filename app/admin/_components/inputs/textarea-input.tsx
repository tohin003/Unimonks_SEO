"use client";

type TextareaInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  id?: string;
  rows?: number;
  placeholder?: string;
  helpText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  monospace?: boolean;
};

export function TextareaInput({
  label,
  value,
  onChange,
  id,
  rows = 4,
  placeholder,
  helpText,
  error,
  required,
  disabled,
  monospace,
}: TextareaInputProps) {
  const inputId =
    id ?? `textarea-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <label
      htmlFor={inputId}
      className="block text-sm font-medium text-slate-700"
    >
      <span className="mb-2 flex items-center justify-between gap-2">
        <span>
          {label}
          {required ? <span className="ml-1 text-rose-500">*</span> : null}
        </span>
        {helpText ? (
          <span className="text-xs font-normal text-slate-500">{helpText}</span>
        ) : null}
      </span>
      <textarea
        id={inputId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 ${
          monospace ? "font-mono leading-6" : "leading-7"
        } ${
          error
            ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
            : "border-slate-200 focus:border-primary focus:ring-primary/10"
        }`}
      />
      {error ? (
        <span className="mt-2 block text-xs text-rose-600">{error}</span>
      ) : null}
    </label>
  );
}
