"use client";

type RepeatableGroupProps<T> = {
  label: string;
  values: T[];
  onChange: (values: T[]) => void;
  createNew: () => T;
  renderItem: (props: {
    value: T;
    index: number;
    onChange: (value: T) => void;
  }) => React.ReactNode;
  itemLabel?: string;
  itemSummary?: (value: T, index: number) => string;
  emptyMessage?: string;
  collapsible?: boolean;
};

export function RepeatableGroup<T>({
  label,
  values,
  onChange,
  createNew,
  renderItem,
  itemLabel = "Entry",
  itemSummary,
  emptyMessage = "No entries yet.",
  collapsible = true,
}: RepeatableGroupProps<T>) {
  function updateAt(index: number, value: T) {
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
    onChange([...values, createNew()]);
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          {label}
        </h3>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-on-primary transition-transform hover:-translate-y-0.5"
        >
          + Add {itemLabel.toLowerCase()}
        </button>
      </div>

      {values.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500">
          {emptyMessage}
        </p>
      ) : (
        <ol className="space-y-3">
          {values.map((value, index) => {
            const summary = itemSummary?.(value, index);
            const itemBody = renderItem({
              value,
              index,
              onChange: (next) => updateAt(index, next),
            });

            return (
              <li key={index} className="panel p-5">
                <header className="mb-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                      {itemLabel} {index + 1}
                    </p>
                    {summary ? (
                      <p className="mt-1 truncate text-sm font-semibold text-primary">
                        {summary}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:border-primary hover:text-primary disabled:opacity-30"
                      aria-label={`Move ${itemLabel.toLowerCase()} up`}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(index)}
                      disabled={index >= values.length - 1}
                      className="rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:border-primary hover:text-primary disabled:opacity-30"
                      aria-label={`Move ${itemLabel.toLowerCase()} down`}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeAt(index)}
                      className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                      aria-label={`Remove ${itemLabel.toLowerCase()}`}
                    >
                      Remove
                    </button>
                  </div>
                </header>
                {collapsible ? (
                  <details open className="group">
                    <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 group-open:hidden">
                      Expand to edit
                    </summary>
                    <div className="space-y-4">{itemBody}</div>
                  </details>
                ) : (
                  <div className="space-y-4">{itemBody}</div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
