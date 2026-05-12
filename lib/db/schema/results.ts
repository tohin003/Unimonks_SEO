import {
  boolean,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const outcomeGroups = pgTable("outcome_groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  position: integer("position").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const studentOutcomes = pgTable("student_outcomes", {
  id: uuid("id").primaryKey().defaultRandom(),
  groupSlug: text("group_slug").notNull(),
  studentInitials: text("student_initials").notNull(),
  cuetYear: integer("cuet_year").notNull(),
  college: text("college").notNull(),
  course: text("course").notNull(),
  percentile: numeric("percentile"),
  highlight: text("highlight"),
  verified: boolean("verified").notNull().default(false),
  position: integer("position").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
