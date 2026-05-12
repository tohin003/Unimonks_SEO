"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminNavProps = {
  heading: string;
  items: { href: string; label: string }[];
};

export function AdminNav({ heading, items }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <div>
      <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
        {heading}
      </p>
      <ul className="mt-2 space-y-1">
        {items.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block rounded-2xl px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-slate-700 hover:bg-white hover:text-primary"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
