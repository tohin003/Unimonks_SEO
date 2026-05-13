"use client";

type ListInputProps = {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  itemLabel?: string;
  placeholder?: string;
  helpText?: string;
  emptyMessage?: string;
  multiline?: boolean;
};

export function ListInput({
  label,
  values,
  onChange,
  itemLabel = "Item",
  placeholder,
  helpText,
  emptyMessage = "No items yet.",
  multiline = false,
}: ListInputProps) {
  function updateAt(index: number, value: string) {
    const next = [...values];
    next[index] = value;
    onChange(next);
  }

  function removeAt(index: number) {
    const next = [...values];
    next.splice(index, 1);
    onChange(next);
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const next = [...values];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  }

  function moveDown(index: number) {
    if (index >= values.length - 1) return;
    const next = [...values];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  }

  function add() {
    onChange([...values, ""]);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="block text-sm font-medium text-slate-700">{label}</span>
        {helpText ? (
          <span className="text-xs text-slate-500">{helpText}</span>
        ) : null}
      </div>
      {values.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500">
          {emptyMessage}
        </p>
      ) : (
        <ul className="space-y-2">
          {values.map((value, index) => (
            <li
              key={index}
              className="flex items-start gap-2 rounded-2xl border border-slate-200 bg-white p-2"
            >
              <div className="flex flex-col gap-1 pt-1">
                <button
                  type="button"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="rounded-full px-2 py-0.5 text-xs text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                  aria-label={`Move ${itemLabel.toLowerCase()} up`}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(index)}
                  disabled={index >= values.length - 1}
                  className="rounded-full px-2 py-0.5 text-xs text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                  aria-label={`Move ${itemLabel.toLowerCase()} down`}
                >
                  ↓
                </button>
              </div>
              {multiline ? (
                <textarea
                  value={value}
                  onChange={(event) => updateAt(index, event.target.value)}
                  placeholder={placeholder}
                  rows={2}
                  className="min-w-0 flex-1 rounded-xl border border-transparent bg-white px-3 py-2 text-sm leading-6 text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                />
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(event) => updateAt(index, event.target.value)}
                  placeholder={placeholder}
                  className="min-w-0 flex-1 rounded-xl border border-transparent bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                />
              )}
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="rounded-full px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                aria-label={`Remove ${itemLabel.toLowerCase()}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary"
      >
        + Add {itemLabel.toLowerCase()}
      </button>
    </div>
  );
}
