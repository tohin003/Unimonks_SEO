import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Singleton table holding site-wide settings — NAP, social URLs, hero label,
 * founder info, etc. Always exactly one row identified by id = 'singleton'.
 */
export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey().default("singleton"),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  tagline: text("tagline").notNull(),
  siteUrl: text("site_url").notNull(),
  phoneDisplay: text("phone_display").notNull(),
  phoneHref: text("phone_href").notNull(),
  email: text("email").notNull(),
  whatsappHref: text("whatsapp_href").notNull(),
  addressLine1: text("address_line_1").notNull(),
  addressLine2: text("address_line_2").notNull(),
  postalCode: text("postal_code").notNull(),
  addressLocality: text("address_locality").notNull(),
  addressRegion: text("address_region").notNull(),
  addressCountry: text("address_country").notNull(),
  geoLatitude: text("geo_latitude").notNull(),
  geoLongitude: text("geo_longitude").notNull(),
  heroLabel: text("hero_label").notNull(),
  foundingDate: text("founding_date").notNull(),
  founderName: text("founder_name").notNull(),
  founderRole: text("founder_role").notNull(),
  areaServed: jsonb("area_served").$type<string[]>().notNull().default([]),
  knowsAbout: jsonb("knows_about").$type<string[]>().notNull().default([]),
  sameAs: jsonb("same_as").$type<string[]>().notNull().default([]),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Generic page metadata for each editable public page (home, about, faculty,
 * results, hub, enroll). Section content lives in the page-specific tables;
 * this table is for SEO + page-level fields the admin can edit independently.
 */
export const pageMetadata = pgTable("page_metadata", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  canonicalPath: text("canonical_path").notNull(),
  keywords: jsonb("keywords").$type<string[]>().notNull().default([]),
  heroImageAssetId: uuid("hero_image_asset_id"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Generic section content keyed by (page slug, section key). The `content`
 * jsonb holds the structured payload for that section — typed at the
 * application layer via Zod schemas in lib/content/<scope>.ts.
 */
export const pageSections = pgTable("page_sections", {
  id: uuid("id").primaryKey().defaultRandom(),
  pageSlug: text("page_slug").notNull(),
  sectionKey: text("section_key").notNull(),
  position: integer("position").notNull().default(0),
  content: jsonb("content").notNull(),
  draftContent: jsonb("draft_content"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const programs = pgTable("programs", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  summary: text("summary").notNull(),
  bullets: jsonb("bullets").$type<string[]>().notNull().default([]),
  position: integer("position").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const knowledgeTracks = pgTable("knowledge_tracks", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  position: integer("position").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const faqItems = pgTable("faq_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  scope: text("scope").notNull().default("home"),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  position: integer("position").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const pressMentions = pgTable("press_mentions", {
  id: uuid("id").primaryKey().defaultRandom(),
  publication: text("publication").notNull(),
  url: text("url"),
  position: integer("position").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
