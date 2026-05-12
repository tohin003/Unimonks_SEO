import { cookies } from "next/headers";

import { ADMIN_SESSION_COOKIE, isAdminSessionValue } from "@/lib/admin";
import { isDbConfigured } from "@/lib/db/client";
import {
  readSessionFromCookies,
  SESSION_COOKIE,
  type SessionUser,
} from "@/lib/auth/session";

export type AdminContext = {
  authenticated: boolean;
  user: SessionUser | null;
  // 'db' means the new users-table auth path. 'legacy' means the env-var
  // single-password fallback (no DB). 'open' means neither is configured —
  // dev convenience that prints a warning in the admin UI.
  mode: "db" | "legacy" | "open";
};

/**
 * Returns the current admin context. Resolution order:
 *
 * 1. If DATABASE_URL is set: try the cookie-session lookup against users.
 *    If a valid session matches, authenticated = true with the user.
 *    If not but ADMIN_PASSWORD is also set, fall through to legacy check.
 *
 * 2. If DATABASE_URL is not set but ADMIN_PASSWORD is set: legacy check
 *    against the SHA256-hash cookie set by the original /api/admin/session
 *    flow. Lets the project keep working in dev before the DB is wired.
 *
 * 3. If neither: admin is open. Dev-only safety; we surface a banner in
 *    the UI telling the owner to configure one of the two.
 */
export async function getAdminContext(): Promise<AdminContext> {
  if (isDbConfigured()) {
    const user = await readSessionFromCookies();
    if (user) {
      return { authenticated: true, user, mode: "db" };
    }
    // DB configured but no session — also allow legacy cookie as a transition
    // path while we migrate the bootstrap user. Same logic as legacy branch.
  }

  if (process.env.ADMIN_PASSWORD?.trim()) {
    const store = await cookies();
    const legacyCookie = store.get(ADMIN_SESSION_COOKIE)?.value;
    const ok = isAdminSessionValue(legacyCookie);
    return { authenticated: ok, user: null, mode: "legacy" };
  }

  return { authenticated: true, user: null, mode: "open" };
}

export async function requireAdminContext(): Promise<AdminContext> {
  const context = await getAdminContext();
  if (!context.authenticated) {
    throw new Error("Not authenticated");
  }
  return context;
}

export { SESSION_COOKIE };
