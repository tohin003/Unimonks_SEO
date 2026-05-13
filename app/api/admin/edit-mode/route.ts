import { NextRequest, NextResponse } from "next/server";

import { getAdminContext } from "@/lib/auth/current-user";
import { buildEditModeCookie } from "@/lib/auth/edit-mode";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ctx = await getAdminContext();
  if (!ctx.authenticated) {
    return NextResponse.json(
      { ok: false, message: "Not authenticated." },
      { status: 401 },
    );
  }

  const body = (await request.json().catch(() => null)) as
    | { on?: boolean }
    | null;
  const on = body?.on === true;

  const response = NextResponse.json({ ok: true, editMode: on });
  response.cookies.set(buildEditModeCookie(on));
  return response;
}
