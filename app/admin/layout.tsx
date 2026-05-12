import type { Metadata } from "next";
import Link from "next/link";

import { Logo } from "@/components/logo";
import { getAdminContext } from "@/lib/auth/current-user";
import { locations } from "@/lib/locations";
import { siteConfig } from "@/lib/site";

import { AdminLoginScreen } from "./_components/admin-login-screen";
import { AdminLogoutButton } from "./_components/admin-logout-button";
import { AdminNav } from "./_components/admin-nav";

import "./admin.css";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · UNIMONKS Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = await getAdminContext();

  const sections = [
    {
      heading: "Overview",
      items: [{ href: "/admin", label: "Dashboard" }],
    },
    {
      heading: "Pages",
      items: [
        { href: "/admin/pages/home", label: "Home" },
        { href: "/admin/pages/about", label: "About" },
        { href: "/admin/pages/faculty", label: "Faculty" },
        { href: "/admin/pages/results", label: "Results" },
        { href: "/admin/pages/hub", label: "Knowledge Hub" },
        { href: "/admin/pages/enroll", label: "Enroll" },
      ],
    },
    {
      heading: "Locations",
      items: locations.map((location) => ({
        href: `/admin/locations/${location.slug}`,
        label: location.area,
      })),
    },
    {
      heading: "Content",
      items: [
        { href: "/admin/blog", label: "Blog posts" },
        { href: "/admin/showcase", label: "Image showcase" },
        { href: "/admin/media", label: "Media library" },
      ],
    },
    {
      heading: "Settings",
      items: [
        { href: "/admin/settings/site", label: "Site (NAP, social)" },
        { href: "/admin/settings/press", label: "Press mentions" },
        { href: "/admin/settings/programs", label: "Programs" },
        { href: "/admin/settings/knowledge-tracks", label: "Knowledge tracks" },
        { href: "/admin/settings/faqs", label: "FAQs" },
      ],
    },
  ];

  if (!context.authenticated) {
    return <AdminLoginScreen authMode={context.mode} />;
  }

  return (
    <div className="admin-shell min-h-screen">
      <header className="admin-topbar sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 px-6 py-3 md:px-8">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
              Admin
            </span>
            {context.mode === "open" ? (
              <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-900">
                Open mode — protect before deploy
              </span>
            ) : null}
            {context.mode === "legacy" ? (
              <span className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                Legacy auth
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary"
            >
              View live site
            </Link>
            {context.user ? (
              <span className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 md:inline">
                {context.user.name} · {context.user.role}
              </span>
            ) : null}
            {context.mode !== "open" ? <AdminLogoutButton /> : null}
          </div>
        </div>
      </header>
      <div className="admin-body mx-auto flex w-full max-w-[1480px] gap-8 px-4 py-8 md:px-8">
        <aside className="admin-sidebar w-64 shrink-0">
          <nav aria-label="Admin sections" className="space-y-7">
            {sections.map((section) => (
              <AdminNav
                key={section.heading}
                heading={section.heading}
                items={section.items}
              />
            ))}
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 text-xs leading-6 text-slate-600">
              <p className="font-semibold text-primary">
                Need help editing?
              </p>
              <p className="mt-2">
                Each section saves to {siteConfig.name}&apos;s database, then
                rebuilds the matching public page. Wait a few seconds and
                refresh the live site.
              </p>
            </div>
          </nav>
        </aside>
        <main id="main" className="admin-main min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
