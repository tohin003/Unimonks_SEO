import { NextRequest, NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionValue,
  isAdminProtected,
  verifyAdminPassword,
} from "@/lib/admin";

export const runtime = "nodejs";

const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 12,
};

export async function POST(request: NextRequest) {
  if (!isAdminProtected()) {
    return NextResponse.json({ ok: true, protected: false });
  }

  const body = (await request.json().catch(() => null)) as
    | { password?: unknown }
    | null;
  const password =
    body && typeof body.password === "string" ? body.password : "";

  if (!verifyAdminPassword(password)) {
    return NextResponse.json(
      { ok: false, message: "Incorrect admin password." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true, protected: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: createAdminSessionValue(),
    ...sessionCookieOptions,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    ...sessionCookieOptions,
    maxAge: 0,
  });

  return response;
}
