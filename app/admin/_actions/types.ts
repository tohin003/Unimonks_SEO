export type ActionResult =
  | { ok: true; message?: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export function dbNotConfigured(): ActionResult {
  return {
    ok: false,
    message:
      "Connect a database (DATABASE_URL) to enable persistence. Edits are read-only in dev mode without it.",
  };
}

export function notAuthenticated(): ActionResult {
  return { ok: false, message: "Not authenticated." };
}
