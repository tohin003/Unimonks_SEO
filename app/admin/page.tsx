import Link from "next/link";

import { facultyClusters, featuredFaculty } from "@/lib/faculty";
import { locations } from "@/lib/locations";
import { getPosts } from "@/lib/posts";
import { pressMentions } from "@/lib/press";
import { outcomeGroups } from "@/lib/results";
import { faqItems, knowledgeTracks, programs, siteConfig } from "@/lib/site";

type DashboardStat = {
  label: string;
  value: string;
  hint?: string;
};

type QuickLink = {
  href: string;
  label: string;
  description: string;
};

const quickLinks: QuickLink[] = [
  {
    href: "/admin/pages/home",
    label: "Edit home page",
    description: "Hero copy, proof points, programs intro, FAQ block.",
  },
  {
    href: "/admin/locations/munirka",
    label: "Edit Munirka location",
    description: "Hero, commute, schools, proof points, local FAQs.",
  },
  {
    href: "/admin/blog",
    label: "Manage blog",
    description: "Draft a post, publish updates, attach images.",
  },
  {
    href: "/admin/showcase",
    label: "Update image showcase",
    description: "Reorder the home page sliding cards.",
  },
  {
    href: "/admin/media",
    label: "Open media library",
    description: "Upload images, edit alt text, see usage.",
  },
  {
    href: "/admin/settings/site",
    label: "Site settings",
    description: "NAP, social URLs, phone, email, founder info.",
  },
];

export default async function AdminDashboardPage() {
  const posts = await getPosts({ includeDrafts: true });
  const totalOutcomes = outcomeGroups.reduce(
    (sum, group) => sum + group.outcomes.length,
    0,
  );

  const stats: DashboardStat[] = [
    {
      label: "Location pages",
      value: String(locations.length),
      hint: "Munirka + 5 surrounding areas",
    },
    {
      label: "Blog posts",
      value: String(posts.length),
      hint: `${posts.filter((p) => p.published).length} published`,
    },
    {
      label: "Faculty entries",
      value: String(featuredFaculty.length + facultyClusters.length),
      hint: `${featuredFaculty.length} bios · ${facultyClusters.length} clusters`,
    },
    {
      label: "Result outcomes",
      value: String(totalOutcomes),
      hint: `${outcomeGroups.length} tiers`,
    },
    {
      label: "Programs",
      value: String(programs.length),
      hint: "Foundation, Target, Admissions",
    },
    {
      label: "Knowledge tracks",
      value: String(knowledgeTracks.length),
      hint: "Footer + Hub",
    },
    {
      label: "FAQ items",
      value: String(faqItems.length),
      hint: "Home FAQ block",
    },
    {
      label: "Press mentions",
      value: String(pressMentions.length),
      hint: "National publications",
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <span className="eyebrow">Admin overview</span>
        <h1 className="mt-5 font-headline text-4xl leading-tight text-primary md:text-5xl">
          What you can change today.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
          Every text and image on {siteConfig.name} is editable from this
          dashboard. Pick a section in the left sidebar, or use the quick
          links below to jump into the most common edits.
        </p>
      </header>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Site at a glance
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <article key={stat.label} className="panel p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                {stat.label}
              </p>
              <p className="mt-3 font-headline text-3xl text-primary">
                {stat.value}
              </p>
              {stat.hint ? (
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {stat.hint}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Quick edits
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="panel block p-5 transition-transform hover:-translate-y-0.5"
            >
              <p className="font-headline text-xl leading-tight text-primary">
                {link.label}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {link.description}
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Open →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Recently updated blog posts
        </h2>
        <div className="mt-4 space-y-2">
          {posts.slice(0, 5).map((post) => (
            <Link
              key={post.slug}
              href={`/admin/blog?slug=${encodeURIComponent(post.slug)}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm transition-colors hover:border-primary"
            >
              <span className="font-semibold text-primary">{post.title}</span>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                {post.published ? "Published" : "Draft"} ·{" "}
                {new Date(post.updatedAt ?? post.date).toLocaleDateString(
                  "en-IN",
                )}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
