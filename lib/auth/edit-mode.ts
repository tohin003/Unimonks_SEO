import { cookies } from "next/headers";

export const EDIT_MODE_COOKIE = "unimonks-edit-mode";

/**
 * Returns true only when the admin has explicitly turned edit mode on.
 * Edit mode is a per-session toggle distinct from authentication — admins
 * can be authenticated but not in edit mode, in which case the public site
 * renders without any edit affordances.
 */
export async function isEditModeOn(): Promise<boolean> {
  const store = await cookies();
  return store.get(EDIT_MODE_COOKIE)?.value === "on";
}

export function buildEditModeCookie(on: boolean) {
  return {
    name: EDIT_MODE_COOKIE,
    value: on ? "on" : "",
    httpOnly: false, // readable from client toggle; not a security-sensitive value
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: on ? 60 * 60 * 8 : 0,
  };
}
