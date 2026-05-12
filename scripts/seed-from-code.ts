/**
 * Seed the database from the existing TypeScript/JSON source files.
 *
 * Idempotent: re-running is a no-op for tables that already have rows. Useful
 * for first-time setup once Neon is provisioned, and for refreshing a fresh
 * Neon preview branch.
 *
 * Usage: `npm run db:seed`
 *
 * Requires DATABASE_URL or DATABASE_URL_UNPOOLED to be set.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";

import { hashPassword } from "@/lib/auth/passwords";
import * as schema from "@/lib/db/schema";
import {
  facultyClusters as facultyClusterSeeds,
  featuredFaculty,
} from "@/lib/faculty";
import { locations } from "@/lib/locations";
import { getPosts } from "@/lib/posts";
import { pressMentions } from "@/lib/press";
import { outcomeGroups as outcomeGroupSeeds } from "@/lib/results";
import {
  faqItems,
  knowledgeTracks,
  programs,
  siteConfig,
} from "@/lib/site";

async function main() {
  const url =
    process.env.DATABASE_URL_UNPOOLED?.trim() ||
    process.env.DATABASE_URL?.trim();

  if (!url) {
    console.log(
      "DATABASE_URL not set — skipping seed. Add it to .env.local first.",
    );
    return;
  }

  const client = neon(url);
  const db = drizzle(client, { schema });

  console.log("→ seeding site_settings");
  await db
    .insert(schema.siteSettings)
    .values({
      id: "singleton",
      name: siteConfig.name,
      shortName: siteConfig.shortName,
      title: siteConfig.title,
      description: siteConfig.description,
      tagline: siteConfig.tagline,
      siteUrl: siteConfig.siteUrl,
      phoneDisplay: siteConfig.phoneDisplay,
      phoneHref: siteConfig.phoneHref,
      email: siteConfig.email,
      whatsappHref: siteConfig.whatsappHref,
      addressLine1: siteConfig.addressLines[0],
      addressLine2: siteConfig.addressLines[1],
      postalCode: siteConfig.postalCode,
      addressLocality: siteConfig.addressLocality,
      addressRegion: siteConfig.addressRegion,
      addressCountry: siteConfig.addressCountry,
      geoLatitude: String(siteConfig.geo.latitude),
      geoLongitude: String(siteConfig.geo.longitude),
      heroLabel: siteConfig.heroLabel,
      foundingDate: siteConfig.foundingDate,
      founderName: siteConfig.founder.name,
      founderRole: siteConfig.founder.role,
      areaServed: [...siteConfig.areaServed],
      knowsAbout: [...siteConfig.knowsAbout],
      sameAs: [...siteConfig.sameAs],
    })
    .onConflictDoNothing();

  console.log("→ seeding programs");
  for (let i = 0; i < programs.length; i++) {
    const program = programs[i];
    await db
      .insert(schema.programs)
      .values({
        slug: program.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
        name: program.name,
        summary: program.summary,
        bullets: [...program.bullets],
        position: i,
      })
      .onConflictDoNothing();
  }

  console.log("→ seeding knowledge_tracks");
  for (let i = 0; i < knowledgeTracks.length; i++) {
    const track = knowledgeTracks[i];
    await db
      .insert(schema.knowledgeTracks)
      .values({
        slug: track.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
        title: track.title,
        description: track.description,
        position: i,
      })
      .onConflictDoNothing();
  }

  console.log("→ seeding faq_items");
  for (let i = 0; i < faqItems.length; i++) {
    const faq = faqItems[i];
    await db
      .insert(schema.faqItems)
      .values({
        scope: "home",
        question: faq.question,
        answer: faq.answer,
        position: i,
      })
      .onConflictDoNothing();
  }

  console.log("→ seeding press_mentions");
  for (let i = 0; i < pressMentions.length; i++) {
    const mention = pressMentions[i];
    await db
      .insert(schema.pressMentions)
      .values({
        publication: mention.publication,
        url: mention.url ?? null,
        position: i,
      })
      .onConflictDoNothing();
  }

  console.log("→ seeding location_pages");
  for (let i = 0; i < locations.length; i++) {
    const location = locations[i];
    await db
      .insert(schema.locationPages)
      .values({
        slug: location.slug,
        area: location.area,
        fullName: location.fullName,
        searchQuery: location.searchQuery,
        metaTitle: location.metaTitle,
        metaDescription: location.metaDescription,
        heroEyebrow: location.heroEyebrow,
        heroHeadline: location.heroHeadline,
        intro: location.intro,
        commuteHeading: location.commuteHeading,
        commuteParagraphs: [...location.commuteParagraphs],
        metroNote: location.metroNote,
        driveNote: location.driveNote,
        landmarks: [...location.landmarks],
        schools: [...location.schools],
        whyHere: location.whyHere,
        proofPoints: [...location.proofPoints],
        position: i,
      })
      .onConflictDoNothing();

    for (let j = 0; j < location.localFaqs.length; j++) {
      const faq = location.localFaqs[j];
      await db
        .insert(schema.locationFaqs)
        .values({
          locationSlug: location.slug,
          question: faq.question,
          answer: faq.answer,
          position: j,
        })
        .onConflictDoNothing();
    }
  }

  console.log("→ seeding faculty_members");
  for (let i = 0; i < featuredFaculty.length; i++) {
    const member = featuredFaculty[i];
    await db
      .insert(schema.facultyMembers)
      .values({
        slug: member.slug,
        name: member.name,
        honorific: member.honorific ?? null,
        role: member.role,
        qualifications: [...member.qualifications],
        alma: [...member.alma],
        subjects: [...member.subjects],
        yearsTeaching: member.yearsTeaching ?? null,
        bio: member.bio,
        isFeatured: 1,
        position: i,
      })
      .onConflictDoNothing();
  }

  console.log("→ seeding faculty_clusters");
  for (let i = 0; i < facultyClusterSeeds.length; i++) {
    const cluster = facultyClusterSeeds[i];
    await db
      .insert(schema.facultyClusters)
      .values({
        slug: cluster.area
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
        area: cluster.area,
        description: cluster.description,
        affiliations: [...cluster.affiliations],
        count: cluster.count,
        position: i,
      })
      .onConflictDoNothing();
  }

  console.log("→ seeding outcome_groups + student_outcomes");
  for (let i = 0; i < outcomeGroupSeeds.length; i++) {
    const group = outcomeGroupSeeds[i];
    await db
      .insert(schema.outcomeGroups)
      .values({
        slug: group.slug,
        title: group.title,
        description: group.description,
        position: i,
      })
      .onConflictDoNothing();

    for (let j = 0; j < group.outcomes.length; j++) {
      const outcome = group.outcomes[j];
      await db
        .insert(schema.studentOutcomes)
        .values({
          groupSlug: group.slug,
          studentInitials: outcome.studentInitials,
          cuetYear: outcome.cuetYear,
          college: outcome.college,
          course: outcome.course,
          percentile:
            outcome.percentile != null ? String(outcome.percentile) : null,
          highlight: outcome.highlight ?? null,
          verified: outcome.verified ?? false,
          position: j,
        })
        .onConflictDoNothing();
    }
  }

  console.log("→ seeding blog_posts");
  const posts = await getPosts({ includeDrafts: true });
  for (const post of posts) {
    await db
      .insert(schema.blogPosts)
      .values({
        slug: post.slug,
        title: post.title,
        description: post.description,
        excerpt: post.excerpt,
        category: post.category,
        date: post.date,
        readingTime: post.readingTime,
        seoQuery: post.seoQuery,
        quickAnswer: post.quickAnswer,
        takeaways: [...post.takeaways],
        body: post.body,
        published: post.published,
      })
      .onConflictDoNothing();
  }

  console.log("→ seeding bootstrap owner user (if absent)");
  const bootstrapEmail = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim();
  const bootstrapPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD?.trim();
  if (bootstrapEmail && bootstrapPassword) {
    const existing = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.users);
    const userCount = existing[0]?.count ?? 0;
    if (userCount === 0) {
      const passwordHash = await hashPassword(bootstrapPassword);
      await db.insert(schema.users).values({
        email: bootstrapEmail,
        name: "UNIMONKS Owner",
        passwordHash,
        role: "owner",
      });
      console.log(`   created owner: ${bootstrapEmail}`);
    } else {
      console.log("   users table is non-empty; skipping bootstrap");
    }
  } else {
    console.log(
      "   ADMIN_BOOTSTRAP_EMAIL / ADMIN_BOOTSTRAP_PASSWORD not set; skipping",
    );
  }

  console.log("✓ seed complete");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
