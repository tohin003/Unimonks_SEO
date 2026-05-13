"use client";

import { useMemo, useState } from "react";

import { TextInput } from "@/app/admin/_components/inputs/text-input";

import type { AuditEntry } from "@/lib/content/audit";

type Props = {
  entries: (Omit<AuditEntry, "createdAt"> & { createdAt: string | Date })[];
};

const actionStyles: Record<string, string> = {
  create: "bg-emerald-50 text-emerald-700 border-emerald-200",
  update: "bg-sky-50 text-sky-700 border-sky-200",
  delete: "bg-rose-50 text-rose-700 border-rose-200",
};

export function AuditTable({ entries }: Props) {
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return entries;
    const q = query.toLowerCase();
    return entries.filter(
      (entry) =>
        entry.action.toLowerCase().includes(q) ||
        entry.entityType.toLowerCase().includes(q) ||
        entry.entityId.toLowerCase().includes(q) ||
        (entry.userEmail ?? "").toLowerCase().includes(q),
    );
  }, [entries, query]);

  return (
    <div className="space-y-4">
      <div className="max-w-md">
        <TextInput
          label="Filter"
          value={query}
          onChange={setQuery}
          placeholder="Search by user, entity, or action"
        />
      </div>

      <div className="panel divide-y divide-slate-200 overflow-hidden p-0">
        {filtered.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No entries match.</p>
        ) : (
          filtered.map((entry) => {
            const created = new Date(entry.createdAt);
            const actionClass =
              actionStyles[entry.action] ??
              "bg-slate-50 text-slate-700 border-slate-200";
            const isExpanded = expandedId === entry.id;
            return (
              <article key={entry.id} className="px-5 py-4">
                <header className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${actionClass}`}
                    >
                      {entry.action}
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {entry.entityType}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      {entry.entityId}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>{entry.userEmail ?? "—"}</span>
                    <time dateTime={created.toISOString()}>
                      {created.toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </time>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : entry.id)
                      }
                      className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-primary hover:text-primary"
                    >
                      {isExpanded ? "Hide diff" : "Show diff"}
                    </button>
                  </div>
                </header>
                {isExpanded ? (
                  <pre className="mt-3 max-h-96 overflow-auto rounded-2xl bg-slate-50 p-4 font-mono text-[11px] leading-5 text-slate-700">
                    {JSON.stringify(entry.diff, null, 2)}
                  </pre>
                ) : null}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
