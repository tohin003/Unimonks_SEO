import Link from "next/link";

import { siteConfig } from "@/lib/site";
import { Logo } from "@/components/logo";

const navLinks = [
  { href: "/#programs", label: "Courses" },
  { href: "/hub", label: "Knowledge Hub" },
  { href: "/blog", label: "Blog" },
  { href: "/#faq", label: "FAQs" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10">
        <Logo showTagline />
        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={siteConfig.phoneHref}
            className="hidden rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary sm:inline-flex"
          >
            Call
          </a>
          <Link
            href="/enroll#lead-form"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            Book Counseling
          </Link>
          <details className="relative md:hidden">
            <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition-colors hover:border-primary hover:text-primary [&::-webkit-details-marker]:hidden">
              <span className="sr-only">Open menu</span>
              <span className="flex flex-col gap-1.5">
                <span className="block h-0.5 w-5 rounded-full bg-current" />
                <span className="block h-0.5 w-5 rounded-full bg-current" />
                <span className="block h-0.5 w-5 rounded-full bg-current" />
              </span>
            </summary>
            <div className="absolute right-0 top-[calc(100%+0.75rem)] w-72 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.35)]">
              <nav aria-label="Mobile primary" className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4">
                <a
                  href={siteConfig.phoneHref}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary"
                >
                  Call {siteConfig.phoneDisplay}
                </a>
                <Link
                  href="/enroll#lead-form"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition-transform hover:-translate-y-0.5"
                >
                  Book Counseling
                </Link>
              </div>
            </div>
          </details>
          <Link
            href="/enroll#lead-form"
            className="inline-flex rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-transform hover:-translate-y-0.5 sm:hidden"
          >
            Book
          </Link>
        </div>
      </div>
    </header>
  );
}
