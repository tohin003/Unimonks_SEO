import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

import { getDb } from "@/lib/db/client";
import { sessions, users } from "@/lib/db/schema";

export const SESSION_COOKIE = "unimonks-admin-session";
export const SESSION_LIFETIME_DAYS = 14;

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "owner" | "editor";
};

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export async function issueSession(userId: string): Promise<string> {
  const db = getDb();
  const token = createSessionToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(
    Date.now() + SESSION_LIFETIME_DAYS * 24 * 60 * 60 * 1000,
  );

  if (db) {
    await db.insert(sessions).values({
      userId,
      tokenHash,
      expiresAt,
    });
  }

  return token;
}

export async function revokeSessionByToken(token: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  const tokenHash = hashToken(token);
  await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
}

export async function getSessionUser(token: string | undefined): Promise<SessionUser | null> {
  if (!token) return null;
  const db = getDb();
  if (!db) return null;
  const tokenHash = hashToken(token);

  try {
    const rows = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        expiresAt: sessions.expiresAt,
      })
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.userId))
      .where(eq(sessions.tokenHash, tokenHash))
      .limit(1);

    const row = rows[0];
    if (!row) return null;
    if (row.expiresAt.getTime() < Date.now()) return null;

    return {
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role === "owner" ? "owner" : "editor",
    };
  } catch (error) {
    // Auth lookups must never crash a page render. Treat any DB blip
    // (cold start, connection reset, transient Neon failure) as "no
    // session" so public routes stay up even when auth lookup is
    // briefly unhealthy.
    console.error("[auth] getSessionUser failed", error);
    return null;
  }
}

export async function readSessionFromCookies(): Promise<SessionUser | null> {
  const store = await cookies();
  const cookie = store.get(SESSION_COOKIE);
  return getSessionUser(cookie?.value);
}

export function buildSessionCookie(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_LIFETIME_DAYS * 24 * 60 * 60,
  };
}

export function buildClearCookie() {
  return {
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}

/**
 * Constant-time string compare for the legacy single-password fallback path.
 */
export function safeStringEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}
