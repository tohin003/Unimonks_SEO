import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import type { LocationProof } from "@/lib/locations";

export const locationPages = pgTable("location_pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  area: text("area").notNull(),
  fullName: text("full_name").notNull(),
  searchQuery: text("search_query").notNull(),
  metaTitle: text("meta_title").notNull(),
  metaDescription: text("meta_description").notNull(),
  heroEyebrow: text("hero_eyebrow").notNull(),
  heroHeadline: text("hero_headline").notNull(),
  intro: text("intro").notNull(),
  commuteHeading: text("commute_heading").notNull(),
  commuteParagraphs: jsonb("commute_paragraphs")
    .$type<string[]>()
    .notNull()
    .default([]),
  metroNote: text("metro_note").notNull(),
  driveNote: text("drive_note").notNull(),
  landmarks: jsonb("landmarks").$type<string[]>().notNull().default([]),
  schools: jsonb("schools").$type<string[]>().notNull().default([]),
  whyHere: text("why_here").notNull(),
  proofPoints: jsonb("proof_points")
    .$type<LocationProof[]>()
    .notNull()
    .default([]),
  heroImageAssetId: uuid("hero_image_asset_id"),
  position: integer("position").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const locationFaqs = pgTable("location_faqs", {
  id: uuid("id").primaryKey().defaultRandom(),
  locationSlug: text("location_slug").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  position: integer("position").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
