import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const facultyMembers = pgTable("faculty_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  honorific: text("honorific"),
  role: text("role").notNull(),
  qualifications: jsonb("qualifications")
    .$type<string[]>()
    .notNull()
    .default([]),
  alma: jsonb("alma").$type<string[]>().notNull().default([]),
  subjects: jsonb("subjects").$type<string[]>().notNull().default([]),
  yearsTeaching: integer("years_teaching"),
  bio: text("bio").notNull(),
  portraitAssetId: uuid("portrait_asset_id"),
  isFeatured: integer("is_featured").notNull().default(0),
  position: integer("position").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const facultyClusters = pgTable("faculty_clusters", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  area: text("area").notNull(),
  description: text("description").notNull(),
  affiliations: jsonb("affiliations")
    .$type<string[]>()
    .notNull()
    .default([]),
  count: text("count").notNull(),
  position: integer("position").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
