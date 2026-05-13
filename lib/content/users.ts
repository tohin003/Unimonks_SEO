import { asc } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { users } from "@/lib/db/schema";

export type AdminUserSummary = {
  id: string;
  email: string;
  name: string;
  role: "owner" | "editor";
  createdAt: Date;
  lastLoginAt: Date | null;
};

export async function listAdminUsers(): Promise<AdminUserSummary[]> {
  const db = getDb();
  if (!db) return [];

  try {
    const rows = await db
      .select()
      .from(users)
      .orderBy(asc(users.createdAt));

    return rows.map((row) => ({
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role === "owner" ? "owner" : "editor",
      createdAt: row.createdAt,
      lastLoginAt: row.lastLoginAt ?? null,
    }));
  } catch (error) {
    console.error("[content] listAdminUsers failed", error);
    return [];
  }
}
