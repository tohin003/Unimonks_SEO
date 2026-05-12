import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const mediaAssets = pgTable(
  "media_assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    storageKey: text("storage_key").notNull().unique(),
    publicUrl: text("public_url").notNull(),
    storageDriver: text("storage_driver").notNull(),
    mimeType: text("mime_type").notNull(),
    fileSize: integer("file_size").notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    altText: text("alt_text").notNull().default(""),
    title: text("title"),
    caption: text("caption"),
    uploadedById: uuid("uploaded_by_id"),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    activeIdx: index("media_assets_active_idx").on(table.deletedAt),
  }),
);

export const imageShowcaseSlides = pgTable("image_showcase_slides", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id").notNull(),
  headline: text("headline").notNull(),
  subhead: text("subhead"),
  linkUrl: text("link_url"),
  enabled: integer("enabled").notNull().default(1),
  position: integer("position").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
