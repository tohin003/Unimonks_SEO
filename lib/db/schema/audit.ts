import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id"),
    userEmail: text("user_email"),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    diff: jsonb("diff"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    entityIdx: index("audit_log_entity_idx").on(
      table.entityType,
      table.entityId,
    ),
    userIdx: index("audit_log_user_idx").on(table.userId),
    createdIdx: index("audit_log_created_idx").on(table.createdAt),
  }),
);
