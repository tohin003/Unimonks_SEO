import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionValue,
  isAdminProtected,
  verifyAdminPassword,
} from "@/lib/admin";
import { verifyPassword } from "@/lib/auth/passwords";
import {
  buildClearCookie,
  buildSessionCookie,
  issueSession,
  revokeSessionByToken,
  SESSION_COOKIE,
} from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { users } from "@/lib/db/schema";

export const runtime = "nodejs";

const legacyCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 12,
};

type LoginBody = {
  email?: unknown;
  password?: unknown;
};

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as LoginBody | null;
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  const db = getDb();

  // New flow: email + password against the users table.
  if (db && email) {
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    const user = rows[0];
    if (!user) {
      return NextResponse.json(
        { ok: false, message: "Email or password is incorrect." },
        { status: 401 },
      );
    }
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { ok: false, message: "Email or password is incorrect." },
        { status: 401 },
      );
    }
    const token = await issueSession(user.id);
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    const response = NextResponse.json({
      ok: true,
      mode: "db",
      user: { email: user.email, name: user.name, role: user.role },
    });
    response.cookies.set(buildSessionCookie(token));
    return response;
  }

  // Legacy fallback: single ADMIN_PASSWORD.
  if (!isAdminProtected()) {
    return NextResponse.json({ ok: true, mode: "open", protected: false });
  }

  if (!verifyAdminPassword(password)) {
    return NextResponse.json(
      { ok: false, message: "Incorrect admin password." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({
    ok: true,
    mode: "legacy",
    protected: true,
  });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: createAdminSessionValue(),
    ...legacyCookieOptions,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });

  // Revoke DB session if present.
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionToken) {
    await revokeSessionByToken(sessionToken);
  }

  // Clear both cookies regardless — both may exist during migration.
  response.cookies.set(buildClearCookie());
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    ...legacyCookieOptions,
    maxAge: 0,
  });

  return response;
}

