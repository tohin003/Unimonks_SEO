CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'editor' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_login_at" timestamp with time zone,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "faq_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scope" text DEFAULT 'home' NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_tracks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "knowledge_tracks_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "page_metadata" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"canonical_path" text NOT NULL,
	"keywords" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"hero_image_asset_id" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "page_metadata_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "page_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_slug" text NOT NULL,
	"section_key" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"content" jsonb NOT NULL,
	"draft_content" jsonb,
	"published_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "press_mentions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"publication" text NOT NULL,
	"url" text,
	"position" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "programs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"summary" text NOT NULL,
	"bullets" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "programs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" text PRIMARY KEY DEFAULT 'singleton' NOT NULL,
	"name" text NOT NULL,
	"short_name" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"tagline" text NOT NULL,
	"site_url" text NOT NULL,
	"phone_display" text NOT NULL,
	"phone_href" text NOT NULL,
	"email" text NOT NULL,
	"whatsapp_href" text NOT NULL,
	"address_line_1" text NOT NULL,
	"address_line_2" text NOT NULL,
	"postal_code" text NOT NULL,
	"address_locality" text NOT NULL,
	"address_region" text NOT NULL,
	"address_country" text NOT NULL,
	"geo_latitude" text NOT NULL,
	"geo_longitude" text NOT NULL,
	"hero_label" text NOT NULL,
	"founding_date" text NOT NULL,
	"founder_name" text NOT NULL,
	"founder_role" text NOT NULL,
	"area_served" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"knows_about" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"same_as" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "location_faqs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"location_slug" text NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "location_pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"area" text NOT NULL,
	"full_name" text NOT NULL,
	"search_query" text NOT NULL,
	"meta_title" text NOT NULL,
	"meta_description" text NOT NULL,
	"hero_eyebrow" text NOT NULL,
	"hero_headline" text NOT NULL,
	"intro" text NOT NULL,
	"commute_heading" text NOT NULL,
	"commute_paragraphs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"metro_note" text NOT NULL,
	"drive_note" text NOT NULL,
	"landmarks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"schools" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"why_here" text NOT NULL,
	"proof_points" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"hero_image_asset_id" uuid,
	"position" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "location_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "faculty_clusters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"area" text NOT NULL,
	"description" text NOT NULL,
	"affiliations" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"count" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "faculty_clusters_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "faculty_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"honorific" text,
	"role" text NOT NULL,
	"qualifications" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"alma" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"subjects" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"years_teaching" integer,
	"bio" text NOT NULL,
	"portrait_asset_id" uuid,
	"is_featured" integer DEFAULT 0 NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "faculty_members_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "outcome_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "outcome_groups_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "student_outcomes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"group_slug" text NOT NULL,
	"student_initials" text NOT NULL,
	"cuet_year" integer NOT NULL,
	"college" text NOT NULL,
	"course" text NOT NULL,
	"percentile" numeric,
	"highlight" text,
	"verified" boolean DEFAULT false NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_post_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"caption" text,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"excerpt" text NOT NULL,
	"category" text NOT NULL,
	"date" text NOT NULL,
	"reading_time" text NOT NULL,
	"seo_query" text NOT NULL,
	"quick_answer" text NOT NULL,
	"takeaways" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"body" text NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"cover_image_asset_id" uuid,
	"scheduled_publish_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "image_showcase_slides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL,
	"headline" text NOT NULL,
	"subhead" text,
	"link_url" text,
	"enabled" integer DEFAULT 1 NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"storage_key" text NOT NULL,
	"public_url" text NOT NULL,
	"storage_driver" text NOT NULL,
	"mime_type" text NOT NULL,
	"file_size" integer NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"alt_text" text DEFAULT '' NOT NULL,
	"title" text,
	"caption" text,
	"uploaded_by_id" uuid,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_assets_storage_key_unique" UNIQUE("storage_key")
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"user_email" text,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"diff" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_token_idx" ON "sessions" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "blog_posts_published_idx" ON "blog_posts" USING btree ("published");--> statement-breakpoint
CREATE INDEX "blog_posts_category_idx" ON "blog_posts" USING btree ("category");--> statement-breakpoint
CREATE INDEX "media_assets_active_idx" ON "media_assets" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "audit_log_entity_idx" ON "audit_log" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "audit_log_user_idx" ON "audit_log" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_log_created_idx" ON "audit_log" USING btree ("created_at");