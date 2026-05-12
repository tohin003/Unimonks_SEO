# UNIMONKS Admin CMS — Implementation Plan

> **Status:** Decisions locked 2026-05-12. Implementation in progress.
>
> **Locked decisions:**
> - **No real Neon/R2 credentials in development.** Build with a fallback layer: if `DATABASE_URL` is missing, getters read from existing TS/JSON sources (today's behaviour). If `R2_*` is missing, uploads write to `public/uploads/`. Production swaps both via env vars only — zero code change at cutover.
> - **Cloudflare Images: skipped.** R2 originals via `next/image` + explicit width/height.
> - **Editable image surfaces:** image-showcase slides, blog covers + inline body images, faculty portraits, hero photos on every page.
> - **Image design directive (user):** "should not look like a generic site made by AI… proper design ratios, font styles and color theory… on top of the current frontend theme without hampering the current homepage animation." Translated into concrete component contracts in §6.6.
>
> **Goal:** turn `/admin` into a full content-management surface that mirrors the live site, lets the owner edit every text + image on every page (home, about, faculty, results, six location pages, hub, enroll, blog), adds a new sliding image-showcase section, and supports image uploads attached to blog posts. Storage: Neon Postgres + Cloudflare R2.

---

## 1. Why this work is happening (context)

The current admin at `/admin` can only edit the blog and ships with a **critical production bug**: it writes to `data/posts.json` via `fs.writeFile`. That path is read-only on Vercel at runtime, so any post saved in production silently fails to persist. The new admin must move all content to a real database AND extend the editable surface to every page on the site.

Concretely, today the editable surface is one route (blog). The new admin needs to be the editable surface for:

- **Home** — hero copy, 3 proof points, 3 programs, 3 support steps, 5 knowledge tracks, FAQ block (5 entries)
- **About** — hero, founder card, 4 guiding commitments
- **Faculty** — hero, founder card, 6 cluster cards
- **Results** — hero, 3 outcome groups with 10+ entries, methodology panel
- **6 Location pages** — for each: hero, intro paragraph, commute paragraphs, landmarks list, schools list, 3 proof points, 3 local FAQs
- **Hub** — hero + 5 knowledge tracks
- **Enroll** — hero + 3 counseling points
- **Blog** — 9 posts today; admin already partially handles this
- **Site-wide settings** — name, NAP, phone, email, social URLs, press mentions, founder info
- **NEW:** Image showcase carousel (sliding picture cards) embeddable on home + blog posts
- **NEW:** Media library (R2-backed) — uploadable images attachable to any page section or blog post

---

## 2. Recommended tech stack

| Layer | Pick | Why |
|---|---|---|
| Framework | **Next.js 16 (already)** | Stay on it — server actions + `revalidatePath` are exactly what the admin needs. |
| Database | **Neon Postgres** (user's pick) | Serverless, generous free tier, branchable (great for previews). |
| ORM | **Drizzle ORM + drizzle-kit** | Lighter than Prisma, edge-runtime friendly, TypeScript-native, no separate generator binary on Vercel cold starts. |
| Migrations | **drizzle-kit generate + push** | Migrations in `lib/db/migrations/` checked into the repo. |
| Object storage | **Cloudflare R2** (user's pick) | S3-compatible, zero egress, cheap. |
| Image CDN/transforms | **Cloudflare Images** (optional but recommended) | On-the-fly resize/format-convert from R2. Saves us building a transform pipeline in Next.js. |
| Image upload pattern | **Presigned PUT URLs from server action to R2** | Browser uploads direct to R2; no large bodies through Vercel functions. |
| Auth | **Custom session: users table + scrypt + httpOnly cookie** | Extends the existing single-password setup to multi-user with audit trails. Simpler than NextAuth for this scope. |
| Rich-text editor | **TipTap (ProseMirror-based)** + custom node for image-cards | Industry standard, full customisability, headless, JSON serialised — perfect for storing in Postgres. |
| Form state | **React Hook Form + Zod** | Validation matches the Drizzle schemas via `drizzle-zod`. |
| Image rendering | **`next/image` + Cloudflare Images loader** | Honest CWV story. |

### Why not...?

- **Prisma** — heavier cold starts on Vercel; Drizzle's TypeScript inference is comparable; migration story is simpler for Neon.
- **NextAuth/Auth.js** — overkill for a single-admin (eventually small team) CMS; adds providers config most users won't touch.
- **Sanity/Contentful/Payload** — third-party lock-in (Sanity/Contentful), or another service to deploy (Payload). User asked for custom Neon + R2; stack above is the minimal honest version of that.

---

## 3. Architectural decisions to lock in first

These decisions block phase 1. Capture answers before coding.

### 3.1 Editing model

Two viable models:

**A. Form-based admin (recommended primary)**
- Each editable page in the main site has a matching admin form at `/admin/site/<slug>` whose fields mirror the page sections.
- The form lives next to a live preview iframe so the owner sees the change land.
- Save → revalidatePath → iframe refreshes → admin sees the change as a visitor would.

**B. Inline visual editor (recommended as Phase 5)**
- When logged in as admin and visiting any live page, every editable region shows a hover overlay with an Edit button.
- Click → modal editor → save → page re-renders.
- Powered by an `EditableBoundary` wrapper component that activates only when an `admin-edit` cookie is present.

Plan delivers **A first** because it's faster to build and covers every editable surface predictably. **B is Phase 5**, added on top of A as a UX accelerator. Both share the same backend.

### 3.2 Content schema model

Two viable storage shapes:

**Strict-typed tables** (recommended): one table per content type — `home_sections`, `location_pages`, `faculty_members`, `results_outcomes`, `blog_posts`, `site_settings`, `media_assets`, etc. Schema enforced; queries are typed.

**Generic key-value content blocks** — one `content_blocks` table with `(scope, key, value_json)`. Easier to extend, weaker types, more bug-prone.

The site's content shape is already strongly typed in `lib/site.ts`, `lib/locations.ts`, etc. Mirror that into Postgres tables. Tables stay closely aligned with the existing TypeScript types — `Location`, `Program`, `FacultyMember`, `StudentOutcome` — so the migration is a port, not a redesign.

### 3.3 Draft vs published workflow

Recommended: every editable record carries `published_at` (nullable) and a `draft_value` JSON column. Public pages read the published value; admin previews can read the draft. This gives a real preview workflow without doubling tables.

### 3.4 Cache + revalidation strategy

- All public pages stay statically generated (matching today's `○` build output).
- After any admin save, the server action calls `revalidatePath` for affected routes + `/sitemap.xml`.
- Optionally tag fetches with `cacheTag()` so a single mutation flushes the precise content scope.

### 3.5 Auth model

- `users` table: `id, email, name, role, password_hash, created_at`.
- Session: scrypt-derived secret stored in httpOnly cookie; rotated on logout.
- Roles: `owner` (everything), `editor` (everything except user management + dangerous settings).
- Migration: the current `ADMIN_PASSWORD` env var becomes the initial `owner` seed user the first time the new auth runs.

---

## 4. Data model overview (Neon Postgres tables)

Naming snake_case. Every table gets `id uuid pk`, `created_at`, `updated_at`. Most content tables also get `published_at`, `draft_value jsonb`, `published_value jsonb`.

| Table | Purpose | Notes |
|---|---|---|
| `users` | Admin accounts | role enum: owner / editor |
| `sessions` | Active login sessions | optional if we use stateless JWT |
| `site_settings` | One row: NAP, social URLs, phone, email, hero label | singleton pattern |
| `pages` | Generic page meta (slug, title, description, canonical) | one row per editable page |
| `home_sections` | Home page structured content (hero, proof points, support steps) | JSON-typed per section |
| `about_sections` | About page structured content | |
| `faculty_members` | Founder card + cluster cards | |
| `outcome_groups` | Results page tiers | parent of `student_outcomes` |
| `student_outcomes` | Individual result entries | linked to `outcome_groups` |
| `location_pages` | One row per area | mirrors `Location` shape from `lib/locations.ts` |
| `location_faqs` | Per-location FAQs | linked to `location_pages` |
| `knowledge_tracks` | Hub topic tracks | |
| `programs` | Course programs (Foundation, Target, Admissions) | |
| `faq_items` | Site-wide FAQ entries | scope column distinguishes home vs location vs location-specific |
| `press_mentions` | Press strip entries | |
| `blog_posts` | Blog | mirrors today's `PostRecord` |
| `blog_post_assets` | Many-to-many between posts and `media_assets` | |
| `media_assets` | Image registry | `r2_key`, `width`, `height`, `mime`, `alt_text`, `uploaded_by` |
| `image_showcase_slides` | Sliding cards (new feature) | `position`, `media_asset_id`, `headline`, `subhead`, `link_url` |
| `audit_log` | Who changed what when | scoped by entity_type + entity_id |

---

## 5. Phased implementation plan

Each phase delivers a coherent, testable slice. After every phase, the site stays fully functional and Vercel deploys cleanly.

### Phase -1 — Dev-prod parity strategy (cross-cutting; no separate phase)

The user does not yet have Neon/R2 credentials and will only get them at production cutover. The whole admin must work in development with **zero external dependencies**. The architecture splits each I/O layer into a driver pattern:

**Content reads:** `lib/db/client.ts` exposes a `getDb()` helper that returns either a real Neon client (when `DATABASE_URL` is set) or `null`. Every getter in `lib/site.ts`, `lib/locations.ts`, etc. is rewritten to call a thin `readX()` function in `lib/content/<scope>.ts` that does:

```
if (db) return queryFromDb()
return readFromSource() // existing TS/JSON sources
```

**Content writes:** if `db` is null, server actions surface a clear "Connect a database to enable persistence" UI in the admin instead of crashing. Read-only admin still works (lists, previews) so the team can plan content even before credentials arrive.

**Image uploads:** `lib/storage/index.ts` exposes a `getStorage()` factory that returns an R2 driver when `R2_*` env is set, else a `LocalStorage` driver that writes uploaded files to `public/uploads/` with a UUID filename. Both drivers implement the same `Storage` interface (`putObject`, `getPublicUrl`, `deleteObject`, `signedPutUrl`). Dev uploads are committed to git via `.gitignore` exception only if needed; otherwise gitignored.

**Auth:** the existing `ADMIN_PASSWORD` single-password flow keeps working in dev (as a fallback when `users` table is empty). Once the user table is populated, the new auth takes over. No development-time disruption.

**Result:** the user can run `npm run dev` today, get the new admin with all editors, upload images locally, and ship to production by adding env vars on Vercel — no code changes needed at cutover.

### Phase 0 — Provision (deferred to production cutover; no longer blocking)

**Outputs of this phase:**
1. Neon account created; database created (call it `unimonks-prod`); connection string captured.
2. Neon branch for previews (`preview`) — let Vercel use it for non-main deployments.
3. Cloudflare account; R2 bucket created (`unimonks-media`); R2 API token with read+write captured.
4. (Optional) Cloudflare Images enabled and linked to R2.
5. Stack decisions confirmed (Drizzle vs Prisma, TipTap vs simple markdown, inline editor in scope or not).
6. Domain decisions: confirm `unimonks.co.in` is production; admin lives at `/admin` (same domain, not a subdomain).

**Env vars added to Vercel + `.env.local`:**

```
DATABASE_URL=postgres://... (Neon pooled)
DATABASE_URL_UNPOOLED=postgres://... (Neon direct, for migrations)
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=unimonks-media
R2_PUBLIC_BASE_URL=https://media.unimonks.co.in (or pages.dev preview)
SESSION_SECRET=<openssl rand -hex 32>
ADMIN_BOOTSTRAP_EMAIL=tohin1400@gmail.com
ADMIN_BOOTSTRAP_PASSWORD=<set during one-time bootstrap then rotate>
```

**Why this is Phase 0 and not Phase 1:** these are account-creation steps the human owner must do; nothing to commit until the keys are available.

---

### Phase 1 — Foundation: DB, ORM, auth, media plumbing (≈4 working days)

**Goal:** the project can read/write Postgres, upload images to R2, authenticate users. No UI changes visible to public.

**Tasks:**

1. **Install + wire Drizzle.**
   - `npm install drizzle-orm pg @neondatabase/serverless drizzle-zod`
   - `npm install -D drizzle-kit`
   - `lib/db/client.ts` — connection factory using `@neondatabase/serverless` http driver.
   - `drizzle.config.ts` at repo root — points at `lib/db/schema/`.
   - `package.json` scripts: `db:generate`, `db:push`, `db:studio`.

2. **Define all tables in `lib/db/schema/`.**
   - One file per content domain (e.g. `users.ts`, `locations.ts`, `blog.ts`, `media.ts`, `site.ts`).
   - Drizzle-zod schemas auto-derived for form validation.

3. **Auth: users table + sessions.**
   - `lib/auth/passwords.ts` — scrypt hashing helpers.
   - `lib/auth/session.ts` — httpOnly cookie issue/verify; reuse `ADMIN_SESSION_COOKIE` name to avoid logging existing users out unnecessarily during migration.
   - `lib/auth/bootstrap.ts` — one-time check that creates the first owner user from `ADMIN_BOOTSTRAP_*` env if `users` is empty.
   - Replace `lib/admin.ts` single-password check with `getCurrentUser()` reading the session cookie + DB lookup.

4. **Migration script: seed DB from current TS/JSON sources.**
   - `scripts/seed-from-code.ts` — reads `lib/site.ts`, `lib/locations.ts`, `lib/faculty.ts`, `lib/results.ts`, `lib/press.ts`, `data/posts.json` and inserts the same data into Postgres.
   - Idempotent: re-running is a no-op if the DB already has rows.
   - Runs as part of `npm run db:seed`.

5. **Switch the public site to read from DB.**
   - Update each `lib/*.ts` getter (e.g. `getPosts`, `getLocationBySlug`, `featuredFaculty`) to query Postgres instead of returning hard-coded values.
   - Wrap each read in `unstable_cache` / `cacheTag` so the static export stays fast.
   - **Hard requirement:** the existing static build output stays unchanged. Verify by diffing the generated HTML for `/`, `/about`, `/faculty`, and one location page before and after this switch.

6. **R2 plumbing.**
   - `lib/storage/r2-client.ts` — `@aws-sdk/client-s3` against R2 endpoint.
   - `lib/storage/presign.ts` — generate presigned PUT URLs.
   - `lib/storage/url.ts` — turn an `r2_key` into a public URL (via `R2_PUBLIC_BASE_URL`).
   - Server action `uploadInitiate({ filename, mime, size })` returns a presigned URL + the eventual public URL.
   - Server action `uploadComplete({ r2Key, alt, width, height })` writes to `media_assets`.

7. **Verification before merge.**
   - `npm run build` clean.
   - Public site renders identically to today (visual diff on Vercel preview).
   - Bootstrap user can log in at `/admin` with new auth.
   - Sample upload through a hidden `/admin/_dev/upload` page lands in R2 and a `media_assets` row exists.

**Files to create:**
- `lib/db/client.ts`
- `lib/db/schema/{users,site,pages,locations,faculty,results,blog,media,showcase,audit}.ts`
- `lib/db/index.ts` (re-exports)
- `lib/auth/{passwords,session,bootstrap}.ts`
- `lib/storage/{r2-client,presign,url}.ts`
- `scripts/seed-from-code.ts`
- `drizzle.config.ts`
- migration SQL under `lib/db/migrations/` (generated)

**Files to modify:**
- `lib/admin.ts` (deprecate in favour of `lib/auth/`)
- `lib/site.ts`, `lib/locations.ts`, `lib/faculty.ts`, `lib/results.ts`, `lib/press.ts`, `lib/posts.ts` (getters → DB-backed)
- `lib/revalidate-content.ts` (cover new editable routes)

**Risk to watch:** the seed-from-code step is the most error-prone. Build a typed schema parser so it catches mismatches at compile time rather than at runtime.

---

### Phase 2 — Admin shell + navigation (≈1 working day)

**Goal:** a coherent admin UI that lists every editable surface on the left, an active editor on the right. Visual language matches the live site exactly — same fonts, `panel`, `eyebrow`, `section-title`, color tokens.

**Tasks:**

1. New layout at `app/admin/layout.tsx` with admin-only nav rail. Sections:
   - **Pages**
     - Home
     - About
     - Faculty
     - Results
     - Hub
     - Enroll
   - **Locations** (collapsible group with 6 entries)
   - **Blog**
   - **Image showcase**
   - **Media library**
   - **Settings**
     - Site (NAP, social, hero label)
     - Press mentions
     - Programs
     - Knowledge tracks
     - FAQs
   - **Account** (logout + later: user management)
2. Each item routes to `/admin/<scope>` or `/admin/<scope>/<id>`.
3. Auth gate via the new `getCurrentUser()` middleware-style check in the layout.
4. Login screen redesigned to handle email + password (was password-only).
5. Audit log surfaced as a sticky drawer (read-only for editors).

**Files to create:**
- `app/admin/layout.tsx`
- `app/admin/_components/admin-nav.tsx`
- `app/admin/_components/admin-shell.tsx`
- `app/admin/_components/audit-drawer.tsx`
- `app/admin/login/page.tsx`

**Files to modify:**
- `app/admin/page.tsx` becomes a dashboard (recent edits, audit summary)
- `app/admin/admin-dashboard.tsx` deprecated (logic moved to `app/admin/blog/page.tsx` in Phase 3)

**Verification:** new admin shell renders, sidebar nav lists every section, every section page is a placeholder that successfully reads its DB row(s). No edits yet — that's Phase 3.

---

### Phase 3 — Per-section editors (≈5 working days)

**Goal:** every text section on the live site is editable through a typed form in the admin. Save → revalidate → iframe preview refreshes → owner sees the change live.

The hardest part of this phase is restraint: the editor for each page must use the **same TS types** the public renderer uses. No drift between admin and public.

#### 3.1 Common editor primitives

Build once, reuse for every page:

- `<TextInput>`, `<TextareaInput>`, `<RichTextInput>` (TipTap), `<ListInput>` (re-orderable string array), `<RepeatableGroup>` (re-orderable record array — used for proof points, FAQ items, schools, landmarks)
- `<ImagePicker>` opens the Media library modal (Phase 4)
- `<SavePanel>` with Save draft / Publish / Discard / Preview-iframe-toggle controls
- `<PreviewFrame>` — iframe to `/<public-path>?admin=preview` that listens for postMessage refresh from save

#### 3.2 Page-by-page editor routes

| Route | Edits | Public path it controls |
|---|---|---|
| `/admin/pages/home` | hero, proof points, support steps, articles intro | `/` |
| `/admin/pages/about` | hero, founder bio, 4 commitments | `/about` |
| `/admin/pages/faculty` | hero, founder card, 6 clusters | `/faculty` |
| `/admin/pages/results` | hero, outcome groups, outcomes, methodology | `/results` |
| `/admin/pages/hub` | hero, knowledge tracks | `/hub` |
| `/admin/pages/enroll` | hero, counseling points | `/enroll` |
| `/admin/locations/[slug]` | every field of one Location | `/cuet-coaching-in-<slug>` |
| `/admin/settings/site` | NAP, social, phone, email | site-wide |
| `/admin/settings/press` | press mentions | press strip |
| `/admin/settings/programs` | Foundation/Target/Admissions | every page that lists programs |
| `/admin/settings/knowledge-tracks` | hub tracks | `/hub` + footer |
| `/admin/settings/faqs` | global FAQ list | `/` |

#### 3.3 Save semantics

- Every editor uses a server action like `updateLocationPage(id, draftPayload, { publish?: boolean })`.
- The action runs the Zod validator, writes either `draft_value` or `published_value`, writes an `audit_log` row, calls `revalidateContentPages()`, returns the updated record.
- The form uses `useTransition` + optimistic state so the UI stays snappy.

#### 3.4 Specific UX touches

- Slug fields auto-generate from the title but stay manually editable.
- JSON-LD-relevant fields (`metaTitle`, `metaDescription`, canonical) are clearly marked as SEO-critical.
- Character count + Google-preview snippet for `meta_title` and `meta_description`.

**Verification per page:** edit a field in admin, hit Save, the preview iframe reflects the change, the public URL reflects the change after revalidate.

---

### Phase 4 — Media library + sliding image showcase (≈3 working days)

**Goal:** the owner can upload images, organise them, attach them to any blog post, and curate a sliding "image cards" section visible on the home page.

#### 4.1 Media library at `/admin/media`

- Grid view of all `media_assets` with filename, preview, dimensions, alt text, "Used in" backlinks.
- Drag-and-drop upload (multiple files at once) using presigned URLs from Phase 1.
- Per-image edit: alt text (SEO-critical), title, optional caption.
- Filter by usage scope (unused, in blog, in showcase, etc.).
- Delete is soft: marks `deleted_at`, prevents new linking, leaves existing references alive (avoids hot links breaking).

#### 4.2 Image showcase / sliding cards section

A new public component used on home and (optionally) inside blog posts.

**Public render (component: `components/image-showcase.tsx`):**
- Horizontal scroll-snapping card row on desktop (CSS `scroll-snap-type: x mandatory`).
- Auto-advancing carousel on mobile (3-4 second interval), pausable on tap.
- Each card: image (R2-hosted, served via `next/image` with Cloudflare loader), headline, optional subhead, optional CTA link.
- Lazy-loaded; first three images use `priority` so the LCP candidate stays healthy.
- Embed on home page between FAQ and "Visit UNIMONKS" sections; embed optionally inside blog posts at the bottom.
- Schema: emits an `ImageGallery` ItemList JSON-LD when ≥3 slides present.

**Admin at `/admin/showcase`:**
- Drag-and-drop reorderable list of slides (`@dnd-kit/sortable`).
- Add new slide → image picker + text fields.
- Each slide can be enabled/disabled.
- Preview iframe of `/` showing the slot live.

#### 4.3 Blog post image attachments

- Blog editor in `/admin/blog/[slug]` gains a "Cover image" field (`<ImagePicker>`) and an "Inline images" library scoped to this post.
- The TipTap editor supports an `image` node — owner drags an image from the panel into the body; gets stored as the asset id in the post JSON.
- Public `BlogPostBody` renders `next/image` with R2 source.

**Schema additions:**
- `media_assets.r2_key`, `media_assets.width`, `media_assets.height` (so layout shift is zero)
- `image_showcase_slides`
- `blog_post_assets` join table

**Verification:**
- Upload 3 images via admin, see them in R2 via Cloudflare dashboard.
- Add them to the showcase, drag to reorder, save, see them on `/`.
- Attach a cover image to an existing blog post; see it on the live post.
- Lighthouse on `/` stays ≥ 90 (Image-Showcase LCP candidate must be priority-loaded).

---

### Phase 5 — Inline visual editor (optional but high-impact; ≈5 working days)

**Goal:** the "admin side is a replica of the main site" UX the user described. When logged in, the owner sees the live site with hover-edit affordances on every editable region.

#### 5.1 Mechanics

- When a logged-in admin requests any public page, the layout reads the `admin-edit` cookie (set when in "edit mode") and conditionally wraps editable regions in `<EditableBoundary scope="…" field="…">`.
- `EditableBoundary` is a client component that:
  - Renders children normally.
  - On hover (admin-only), shows a translucent outline + pencil icon.
  - On click, opens a side drawer with the field's editor.
- "Exit edit mode" toggle in the admin nav.

#### 5.2 What becomes editable inline

Every text region on every page from Phase 3 gets a `scope`/`field` pair. The drawer reuses the same form components from Phase 3 — single source of truth.

#### 5.3 Limits

- Inline editor handles text + simple lists + image swaps.
- Anything structural (re-ordering an outcome group, deleting a faculty cluster, changing a location slug) still requires the form-based admin in Phase 3.

#### 5.4 What this does NOT change

- The animated `landing-book-dock` decorations, hero auras, and CSS-animated elements stay in code. They're decoration, not content. Trying to make decoration database-driven creates a maintenance black hole.

**Verification:**
- Log in, visit `/cuet-coaching-in-vasant-kunj`, click the hero headline, edit it, save, change persists and revalidates.
- Log out, visit the same page incognito; the edit affordances are gone (no leakage to public visitors).

---

### Phase 6 — Polish, drafts, audit, multi-user (≈3 working days)

**Goal:** the admin is production-grade for a small team.

**Tasks:**

1. **Draft preview links** — `/preview?token=<signed>` returns the draft version of any page; tokens expire after 24 hours; share with stakeholders.
2. **Scheduled publish** — `published_at` in the future means the public site does not surface that record until the timestamp arrives; revalidation runs via a Vercel cron (`vercel.json` cron `0 * * * *`).
3. **Audit log UI** — filter by user, by entity type, view JSON diffs.
4. **User management** — `/admin/account/users` (owner-only) lets the owner invite editors via email (Resend or a simpler "create user with temp password" flow).
5. **Backups** — Neon's daily automated backups + a `scripts/export-content.ts` that dumps DB to JSON in `/var/exports/` (or to R2) weekly via Vercel cron.
6. **2FA (optional)** — TOTP using `otpauth` package.

**Verification:**
- Schedule a blog post for tomorrow at noon; verify it appears precisely at noon.
- Invite a test editor; verify their role restrictions hold.
- Roll an export; verify the dump round-trips cleanly through `scripts/seed-from-code.ts` adapted to read JSON.

---

## 6. Cross-cutting concerns

### 6.1 Design coherence (non-negotiable)

Every admin screen reuses the existing site primitives:
- `section-shell`, `panel`, `eyebrow`, `section-title`
- Brand color tokens (`brand-blue`, `brand-pink`, `primary`, `on-primary`)
- System serif headline + sans-serif body
- Same border-radius scale, same shadow recipe (`shadow-[0_24px_70px_-40px_rgba(15,23,42,0.35)]`)

Admin nav and form chrome must feel like part of UNIMONKS, not a generic CMS bolted on.

### 6.2 SEO posture during the migration

- The public site must serve identical HTML before and after Phase 1. Run an HTML diff on `/`, `/about`, `/faculty`, `/results`, `/cuet-coaching-in-munirka`, and `/blog/cuet-last-30-days-plan` between current `main` and Phase-1 branch.
- All structured data factories in `lib/schemas.ts` continue working unchanged — they consume the same shape, just sourced from DB.
- `next/image` widths/heights set everywhere (image showcase, blog covers) to keep CLS ≤ 0.1.
- The static-prerendered route table from `npm run build` should look identical to today's output.

### 6.3 Performance / cost budget

- Neon free tier covers small projects; expect $0–10/month for current traffic.
- R2 free tier: 10 GB storage + class A/B operations — plenty for an institute site.
- Cloudflare Images: $5/month for 100k transforms. Optional.
- The bottleneck is Vercel function execution; presigned uploads keep that minimal.

### 6.4 Security

- Every server action runs `getCurrentUser()` and verifies role.
- Presigned URLs scoped to single-file PUTs with content-type + max size set at sign time.
- Public R2 reads only — admin reads/writes go through Vercel functions, not the browser.
- Rate limit `/api/admin/session` (existing route) — login attempts capped via Upstash or in-memory token bucket.
- Add CSP header allowing R2 image domain + Cloudflare Images origin.

### 6.5 Testing

- `vitest` for the schema parsers (Zod) and seed script.
- `playwright` smoke test that logs in, edits one field, saves, asserts the change on the public page.

### 6.6 Image design language (must match existing site)

The new image-bearing components are designed *with* the existing system, not on top of it. Concrete contracts:

**Shared `<MediaFrame>` primitive** in `components/media-frame.tsx`:
- Wraps `next/image` in a ratio container (`aspect-[ratio]`) with the existing `.panel` border + shadow recipe so images sit in the same visual language as text cards.
- Always renders an explicit width + height (CLS = 0).
- `priority` prop for above-the-fold; off by default.
- Optional `ring` variant uses `ring-1 ring-slate-200/80` for portraits.

**Aspect ratios per surface:**
- Hero photos: `16:9` (or `21:9` cinema for large heroes) with a left-edge linear-gradient overlay from `rgba(248,249,250,0.92)` to transparent, so the existing serif headline stays readable over any image.
- Faculty portraits: `4:5`, rounded-[24px], subtle inner ring.
- Showcase slides: `4:5` portrait or `3:4` — chosen at slide level — with backdrop-blur scrim on the bottom 38% for the headline + subhead overlay.
- Blog covers: `21:9` (cinema), rendered at the top of the post body card.
- Inline blog images: `<figure>` with max-width matching the prose column and a caption beneath in `text-sm leading-7 text-slate-500`.

**Color treatments (within brand palette only):**
- Image overlays use the existing brand colors mixed via CSS color-mix at 8-12% opacity (not arbitrary grays):
  - Hero overlay: `color-mix(in oklch, theme(colors.primary) 92%, transparent)` left edge, fading to transparent.
  - Showcase scrim: `color-mix(in oklch, theme(colors.primary) 78%, transparent)` bottom.
- Hover state on image cards lifts by 2px (matching the existing button hover) and saturates the image by 4%.
- Focus rings reuse `focus:ring-2 focus:ring-primary/10` from existing form inputs.

**Typography over images** uses the same serif headline + sans-serif body the rest of the site uses. Headlines on top of images get a tighter tracking (`tracking-tight`) and a subtle text-shadow only when contrast genuinely needs it — never as a default.

**Animation coexistence:**
- Image components live in the same `landing-page > *` z-index lane as text content, sitting above the `landing-book-dock`, `hero-aura`, `landing-ambient` decoration layers but not interfering with them.
- The home page's hero image (if added) sits beside the headline, not behind the entire hero — the book dock and aura animations stay untouched.
- `@media (prefers-reduced-motion: reduce)` already disables CSS animations site-wide; image components add no new motion that needs disabling.

**Empty / loading states** match the existing skeleton recipe: a panel-colored `bg-slate-100` block at the correct aspect ratio while the image loads (suppresses CLS shift).

This contract is enforced by:
- All image-rendering routes import from the single `<MediaFrame>` primitive.
- A `playwright` visual regression test snapshots the home + faculty + a blog post pre- and post-image-addition.

### 6.7 Rollback plan

- Phase 1's DB cutover is the only risky step. Strategy:
  1. Ship Phase 1 to Vercel preview (Neon `preview` branch).
  2. Run side-by-side HTML diff against production.
  3. When clean, promote — set Vercel production env to point at Neon `main` branch.
  4. Keep the `data/posts.json` + TS source files in the repo for one release cycle as a safety net.
- Each subsequent phase is additive: an admin bug never breaks the public site because public reads continue to work even if admin writes fail.

---

## 7. Open questions to resolve before Phase 1

1. **Editing model commitment** — are we doing inline editor (Phase 5) or stopping at form-based? Affects component architecture in Phase 3.
2. **Cloudflare Images yes/no** — decides whether we serve R2 originals or transformed variants. Recommend yes; budget impact is small.
3. **Multi-user from day one or owner-only initially** — owner-only is simpler; multi-user can wait for Phase 6.
4. **Audit log retention** — keep forever or roll after 90 days?
5. **Domain for media** — `media.unimonks.co.in` (custom domain on R2) or `pub-…r2.dev`? Custom looks more credible.
6. **Bootstrap timing** — when can Neon + R2 be provisioned? Phase 1 is blocked until then.

---

## 8. Estimated timeline

| Phase | Effort | Cumulative |
|---|---|---|
| 0 — Provision | 0.5 day (mostly waiting) | 0.5 |
| 1 — Foundation | 4 days | 4.5 |
| 2 — Admin shell | 1 day | 5.5 |
| 3 — Per-section editors | 5 days | 10.5 |
| 4 — Media + showcase | 3 days | 13.5 |
| 5 — Inline editor (optional) | 5 days | 18.5 |
| 6 — Polish + multi-user | 3 days | 21.5 |

Roughly **2 working weeks for Phases 0–4** (the must-have set), or **4 working weeks for the full vision including Phase 5 + 6**. Each phase can be paused; the site stays live and editable after every phase.

---

## 9. What ships at each phase boundary (acceptance gates)

- **End of Phase 1:** the public site reads from Postgres. Owner can log in with the new auth. Images upload to R2 from a hidden test page. Nothing visibly changes on the live site.
- **End of Phase 2:** the new admin nav shows every editable scope. Each scope page loads its DB row(s) read-only.
- **End of Phase 3:** every text field on every page is editable through a typed form. Save round-trips correctly and shows up on the public site within a second.
- **End of Phase 4:** owner can upload images, build a sliding showcase visible on home, and attach a cover image + body images to blog posts.
- **End of Phase 5:** when logged in, the owner can hover any text on the live site and edit it inline.
- **End of Phase 6:** multi-user with roles, scheduled publishing, audit log UI, weekly backups.
