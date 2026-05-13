import type { Metadata } from "next";

import { StatusBanner } from "@/app/admin/_components/status-banner";
import { getRecentAuditEntries } from "@/lib/content/audit";
import { isDbConfigured } from "@/lib/db/client";

import { AuditTable } from "./audit-table";

export const metadata: Metadata = { title: "Audit log" };

export default async function AdminAuditPage() {
  const entries = await getRecentAuditEntries(200);

  return (
    <div className="space-y-6">
      <header>
        <span className="eyebrow">Audit log</span>
        <h1 className="mt-5 font-headline text-4xl leading-tight text-primary md:text-5xl">
          Every save the admin recorded.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          Each editor write logs a row with the user, the action, the entity,
          and a JSON diff. Useful for tracing &quot;who changed the home
          hero&quot;-style questions.
        </p>
      </header>

      {!isDbConfigured() ? (
        <StatusBanner
          variant="warning"
          message="DATABASE_URL is not configured. No audit rows have been written yet."
        />
      ) : entries.length === 0 ? (
        <StatusBanner
          variant="info"
          message="No audit entries yet — they appear here the moment any editor is saved."
        />
      ) : (
        <AuditTable entries={entries} />
      )}
    </div>
  );
}
