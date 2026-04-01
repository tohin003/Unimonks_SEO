# UNIMONKS SEO Website

UNIMONKS is a Next.js 16 App Router website for CUET coaching in Munirka, New Delhi. It combines:

- a local SEO landing page
- a knowledge hub and public blog
- a counseling form for student leads
- a lightweight admin dashboard for publishing blog posts

## Local Development

```bash
npm install
npm run dev
```

The production build uses:

```bash
npm run build
```

This project currently uses `next build --webpack` because plain `next build` failed on this darwin/x64 environment with Turbopack native bindings.

## Content Storage

Blog posts are stored in [data/posts.json](/Users/xyx/Desktop/Unimonk_SEO/data/posts.json).

Lead submissions are appended to `data/leads.ndjson` by [app/api/leads/route.ts](/Users/xyx/Desktop/Unimonk_SEO/app/api/leads/route.ts).

## Admin Dashboard

Open `/admin` to manage posts.

- Set `ADMIN_PASSWORD` in your environment to protect the dashboard.
- If `ADMIN_PASSWORD` is not set, the admin remains open and shows a warning banner.
- Draft posts stay inside the admin only.
- Published posts appear automatically on `/blog`, `/hub`, the home page, and the sitemap.

### Article Body Format

Inside the admin editor:

- Use `##` for section headings
- Leave a blank line between paragraphs
- Start lines with `-` to create bullet points

## SEO Notes

The site already includes:

- semantic page structure in the App Router
- JSON-LD for `EducationalOrganization`, `Course`, `FAQPage`, and blog content
- dynamic sitemap generation from published posts
- a keyword-focused internal linking flow between the home page, knowledge hub, blog, and counseling page
