import { getDb } from "@/lib/db/client";
import { auditLog } from "@/lib/db/schema";
import type { SessionUser } from "@/lib/auth/session";

type AuditInput = {
  user: SessionUser | null;
  action: string;
  entityType: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
};

/**
 * Record an admin action in the audit_log table. Failures are swallowed —
 * audit must never break the user-visible action it observes.
 */
export async function recordAudit(input: AuditInput): Promise<void> {
  const db = getDb();
  if (!db) return;

  try {
    await db.insert(auditLog).values({
      userId: input.user?.id ?? null,
      userEmail: input.user?.email ?? null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      diff: { before: input.before, after: input.after } as Record<string, unknown>,
    });
  } catch (error) {
    console.error("[audit] failed to record entry", error);
  }
}
