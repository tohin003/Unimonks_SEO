/**
 * Idempotent admin-credentials setter.
 *
 * Use when you need to (re)create the owner user against a live database —
 * the regular `npm run db:seed` only inserts when the users table is empty,
 * so it can't help once a previous bootstrap ran. This script upserts:
 * inserts if the email is new, updates the password hash otherwise.
 *
 * Usage:
 *   DATABASE_URL=<neon-pooled-url> \
 *   ADMIN_BOOTSTRAP_EMAIL=you@example.com \
 *   ADMIN_BOOTSTRAP_PASSWORD='at-least-eight-characters' \
 *   npm run admin:set-password
 *
 * Production note: scrypt rejects passwords shorter than 8 characters at
 * lib/auth/passwords.ts. Pick something stronger than the example above —
 * the admin URL is public.
 */
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

import { hashPassword } from "@/lib/auth/passwords";
import * as schema from "@/lib/db/schema";

async function main() {
  const url = (
    process.env.DATABASE_URL ?? process.env.DATABASE_URL_UNPOOLED
  )?.trim();
  if (!url) {
    console.error(
      "DATABASE_URL (or DATABASE_URL_UNPOOLED) is required. Point it at the Neon database you want to update.",
    );
    process.exit(1);
  }

  const email = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD ?? "";
  const name = process.env.ADMIN_BOOTSTRAP_NAME?.trim() || "UNIMONKS Owner";

  if (!email) {
    console.error("ADMIN_BOOTSTRAP_EMAIL is required.");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error(
      "ADMIN_BOOTSTRAP_PASSWORD must be at least 8 characters (scrypt requirement).",
    );
    process.exit(1);
  }

  const client = neon(url);
  const db = drizzle(client, { schema });

  const passwordHash = await hashPassword(password);

  const existing = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);

  if (existing[0]) {
    await db
      .update(schema.users)
      .set({ passwordHash, name, role: "owner" })
      .where(eq(schema.users.id, existing[0].id));
    console.log(`✓ updated owner credentials for ${email}`);
  } else {
    await db.insert(schema.users).values({
      email,
      name,
      role: "owner",
      passwordHash,
    });
    console.log(`✓ created owner ${email}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
