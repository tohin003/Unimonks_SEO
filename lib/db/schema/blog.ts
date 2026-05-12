import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    excerpt: text("excerpt").notNull(),
    category: text("category").notNull(),
    date: text("date").notNull(),
    readingTime: text("reading_time").notNull(),
    seoQuery: text("seo_query").notNull(),
    quickAnswer: text("quick_answer").notNull(),
    takeaways: jsonb("takeaways").$type<string[]>().notNull().default([]),
    body: text("body").notNull(),
    published: boolean("published").notNull().default(true),
    coverImageAssetId: uuid("cover_image_asset_id"),
    scheduledPublishAt: timestamp("scheduled_publish_at", {
      withTimezone: true,
    }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    publishedIdx: index("blog_posts_published_idx").on(table.published),
    categoryIdx: index("blog_posts_category_idx").on(table.category),
  }),
);

export const blogPostAssets = pgTable("blog_post_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull(),
  assetId: uuid("asset_id").notNull(),
  caption: text("caption"),
  position: integer("position").notNull().default(0),
});
