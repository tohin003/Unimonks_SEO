/**
 * One-shot helper: prints a ready-to-run INSERT statement that creates (or
 * resets) an admin owner user. Run with email + password as env vars, paste
 * the printed SQL into Neon's SQL Editor. Avoids exposing the prod DB URL.
 *
 * Usage:
 *   ADMIN_BOOTSTRAP_EMAIL='you@example.com' \
 *   ADMIN_BOOTSTRAP_PASSWORD='at-least-8-chars' \
 *   npx tsx scripts/print-admin-insert.ts
 */
import { hashPassword } from "@/lib/auth/passwords";

async function main() {
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD ?? "";
  const name = process.env.ADMIN_BOOTSTRAP_NAME?.trim() || "UNIMONKS Owner";

  if (!email) {
    console.error("ADMIN_BOOTSTRAP_EMAIL is required.");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("ADMIN_BOOTSTRAP_PASSWORD must be at least 8 characters.");
    process.exit(1);
  }

  const hash = await hashPassword(password);
  // Escape single quotes for safe SQL embedding.
  const safeEmail = email.replace(/'/g, "''");
  const safeName = name.replace(/'/g, "''");
  const safeHash = hash.replace(/'/g, "''");

  console.log("-- Paste this into Neon's SQL Editor and click Run:");
  console.log(
    `INSERT INTO users (email, name, password_hash, role) VALUES ('${safeEmail}', '${safeName}', '${safeHash}', 'owner') ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name, role = EXCLUDED.role;`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
