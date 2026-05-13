"use client";

type TextInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  id?: string;
  type?: "text" | "email" | "url" | "tel" | "number";
  placeholder?: string;
  helpText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
};

export function TextInput({
  label,
  value,
  onChange,
  id,
  type = "text",
  placeholder,
  helpText,
  error,
  required,
  disabled,
  autoComplete,
}: TextInputProps) {
  const inputId =
    id ?? `text-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
      <span className="mb-2 flex items-center justify-between gap-2">
        <span>
          {label}
          {required ? <span className="ml-1 text-rose-500">*</span> : null}
        </span>
        {helpText ? (
          <span className="text-xs font-normal text-slate-500">{helpText}</span>
        ) : null}
      </span>
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 ${
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
