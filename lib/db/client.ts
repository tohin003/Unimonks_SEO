import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";

import * as schema from "@/lib/db/schema";

export type Database = ReturnType<typeof drizzleNeon<typeof schema>>;

// In Node runtime on Vercel, fetch is global and Neon's HTTP driver uses it.
// On older runtimes you'd need to polyfill. Next.js 16 + Node 20+ is fine.
neonConfig.fetchConnectionCache = true;

let cached: Database | null = null;

/**
 * Returns a Drizzle client backed by Neon Postgres if `DATABASE_URL` is set.
 * Returns `null` when the env var is missing — callers MUST handle the null
 * case and fall back to file-based sources. This is the contract that lets
 * the project run in development without any provisioned database.
 */
export function getDb(): Database | null {
  if (cached) return cached;

  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;

  const client = neon(url);
  cached = drizzleNeon(client, { schema, logger: false });
  return cached;
}

/**
 * Throws if no DB is configured. Use only in admin write paths where the
 * absence of a database is a real error (not a graceful fallback).
 */
export function requireDb(): Database {
  const db = getDb();
  if (!db) {
    throw new Error(
      "DATABASE_URL is not configured. Add it to .env.local or to your Vercel project to enable persistence.",
    );
  }
  return db;
}

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}
