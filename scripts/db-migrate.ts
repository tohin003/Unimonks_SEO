import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import { Pool } from "@neondatabase/serverless";

async function main() {
  const url =
    process.env.DATABASE_URL_UNPOOLED?.trim() ||
    process.env.DATABASE_URL?.trim();

  if (!url) {
    console.log(
      "DATABASE_URL not set — skipping migration. The project keeps running on file-based content.",
    );
    return;
  }

  const pool = new Pool({ connectionString: url });
  try {
    const migrationsDir = path.join(process.cwd(), "lib", "db", "migrations");
    const files = readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const content = readFileSync(filePath, "utf8");
      const statements = content
        .split(/--> statement-breakpoint/)
        .map((s) => s.trim())
        .filter(Boolean);

      console.log(`→ applying ${file} (${statements.length} statements)`);
      for (const statement of statements) {
        await pool.query(statement);
      }
    }

    console.log("✓ migrations complete");
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
