import Link from "next/link";

import { Logo } from "@/components/logo";
import { knowledgeTracks, siteConfig } from "@/lib/site";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/enroll", label: "Book Counseling" },
  { href: "/hub", label: "Knowledge Hub" },
  { href: "/blog", label: "Blog" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/80 bg-[#f4efe5]">
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
