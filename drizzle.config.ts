import { readFileSync } from "node:fs";
import path from "node:path";

import { defineConfig } from "drizzle-kit";

// Minimal .env loader so we don't require the `dotenv` package as a runtime dep.
// drizzle-kit doesn't need DATABASE_URL to `generate` migrations, only to `push`.
try {
  const raw = readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
  for (const line of raw.split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, key, value] = match;
    if (!process.env[key]) {
      process.env[key] = value.replace(/^"|"$/g, "");
    }
  }
} catch {
  // .env.local is optional during migration generation.
}

export default defineConfig({
  schema: "./lib/db/schema/index.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://placeholder",
  },
  verbose: true,
  strict: true,
});
