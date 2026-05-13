import Link from "next/link";

import { Logo } from "@/components/logo";
import { getKnowledgeTracks } from "@/lib/content/knowledge-tracks";
import { getSiteSettings } from "@/lib/content/site";
import { locations } from "@/lib/locations";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About UNIMONKS" },
  { href: "/faculty", label: "Faculty" },
  { href: "/results", label: "Results" },
  { href: "/enroll", label: "Book Counseling" },
  { href: "/hub", label: "Knowledge Hub" },
  { href: "/blog", label: "Blog" },
];

export async function SiteFooter() {
  const [knowledgeTracks, siteConfig] = await Promise.all([
    getKnowledgeTracks(),
    getSiteSettings(),
  ]);
  return (
    <footer className="border-t border-slate-200/80 bg-[#f4efe5]">
      <div className="mx-auto max-w-7xl px-6 pt-14 md:px-10">
        <div className="rounded-[28px] border border-slate-200/80 bg-white/70 p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            CUET coaching across South Delhi
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            One centre in Munirka, students travelling in from every adjacent
            neighbourhood. Each page below shows the commute, nearby schools,
            and the questions families from that area usually ask.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {locations.map((location) => (
              <li key={location.slug}>
                <Link
                  href={`/cuet-coaching-in-${location.slug}`}
                  className="block rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary"
                >
                  <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Coaching in
                  </span>
                  <span className="mt-1 block text-base text-primary">
                    {location.area}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 md:grid-cols-[1.3fr_1fr_1.2fr] md:px-10">
        <div className="space-y-5">
          <Logo showTagline />
          <p className="max-w-md text-sm leading-7 text-slate-600">
            UNIMONKS combines CUET preparation, admissions guidance, and
            student-friendly content so families can read, compare, and book
            the next step without confusion.
          </p>
          <address className="not-italic text-sm leading-7 text-slate-600">
            <p>{siteConfig.addressLines[0]}</p>
            <p>{siteConfig.addressLines[1]}</p>
            <p>
              <a href={siteConfig.phoneHref} className="hover:text-primary">
                {siteConfig.phoneDisplay}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="hover:text-primary"
              >
                {siteConfig.email}
              </a>
            </p>
          </address>
        </div>
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Navigate
          </p>
          <ul className="space-y-3">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-slate-700 transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Search Topics
          </p>
          <ul className="space-y-3">
            {knowledgeTracks.map((track) => (
              <li key={track.title}>
                <p className="text-sm font-semibold text-slate-700">
                  {track.title}
                </p>
                <p className="text-sm leading-6 text-slate-600">
                  {track.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
