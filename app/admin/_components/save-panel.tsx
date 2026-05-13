"use client";

type SavePanelProps = {
  isPending: boolean;
  dirty: boolean;
  onSave: () => void;
  onDiscard?: () => void;
  saveLabel?: string;
};

export function SavePanel({
  isPending,
  dirty,
  onSave,
  onDiscard,
  saveLabel = "Save changes",
}: SavePanelProps) {
  return (
    <div className="sticky bottom-4 z-30">
      <div className="panel flex flex-wrap items-center justify-between gap-3 p-4 md:p-5">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {isPending ? "Saving…" : dirty ? "Unsaved changes" : "All changes saved"}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {onDiscard ? (
            <button
              type="button"
              onClick={onDiscard}
              disabled={!dirty || isPending}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Discard
            </button>
          ) : null}
          <button
            type="button"
            onClick={onSave}
            disabled={!dirty || isPending}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-on-primary transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isPending ? "Saving…" : saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
