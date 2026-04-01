import type { Metadata } from "next";
import { cookies } from "next/headers";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  ADMIN_SESSION_COOKIE,
  isAdminProtected,
  isAdminSessionValue,
} from "@/lib/admin";
import { getPosts } from "@/lib/posts";

import { AdminDashboard } from "./admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const protectedMode = isAdminProtected();
  const authenticated = protectedMode
    ? isAdminSessionValue(
        cookieStore.get(ADMIN_SESSION_COOKIE)?.value,
      )
    : true;
  const posts = authenticated ? await getPosts({ includeDrafts: true }) : [];

  return (
    <>
      <SiteHeader />
      <main id="main" className="pb-20">
        <section className="section-shell py-14 md:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 max-w-3xl">
              <span className="eyebrow">UNIMONKS Admin</span>
              <h1 className="mt-6 font-headline text-5xl leading-[0.96] text-primary md:text-7xl">
                Publish CUET blog posts without touching the codebase.
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                This dashboard is built for the owner to create articles, save
                drafts, publish updates, and keep the website fresh for search
                visitors and counseling leads.
              </p>
            </div>
            <AdminDashboard
              initialPosts={posts}
              authenticated={authenticated}
              protectedMode={protectedMode}
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
