import { desc } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { auditLog } from "@/lib/db/schema";

export type AuditEntry = {
  id: string;
  userId: string | null;
  userEmail: string | null;
  action: string;
  entityType: string;
  entityId: string;
  diff: unknown;
  createdAt: Date;
};

export async function getRecentAuditEntries(
  limit = 100,
): Promise<AuditEntry[]> {
  const db = getDb();
  if (!db) return [];

  try {
    const rows = await db
      .select()
      .from(auditLog)
      .orderBy(desc(auditLog.createdAt))
      .limit(limit);

    return rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      userEmail: row.userEmail,
      action: row.action,
      entityType: row.entityType,
      entityId: row.entityId,
      diff: row.diff,
      createdAt: row.createdAt,
    }));
  } catch (error) {
    console.error("[content] getRecentAuditEntries failed", error);
    return [];
  }
}
