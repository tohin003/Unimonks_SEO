"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type AdminNavProps = {
  heading: string;
  items: { href: string; label: string }[];
};

function storageKey(heading: string) {
  return `unimonks-admin-nav:${heading.toLowerCase().replace(/\s+/g, "-")}`;
}

function isItemActive(itemHref: string, pathname: string) {
  if (itemHref === "/admin") return pathname === "/admin";
  return pathname === itemHref || pathname.startsWith(`${itemHref}/`);
}

export function AdminNav({ heading, items }: AdminNavProps) {
  const pathname = usePathname();
  const hasActive = items.some((item) => isItemActive(item.href, pathname));

  // Hydrate from localStorage after mount so SSR + first paint don't
  // mismatch. Until then we render expanded (the visually safest state).
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey(heading));
    if (saved === "1") setCollapsed(true);
  }, [heading]);

  // A section that contains the active route is always shown, regardless
  // of the user's saved preference — otherwise navigating into a
  // collapsed section would hide the page they just opened.
  const showItems = !collapsed || hasActive;

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(storageKey(heading), next ? "1" : "0");
      return next;
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        className="group flex w-full items-center justify-between gap-2 rounded-md px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 transition-colors hover:text-primary"
        aria-expanded={showItems}
      >
        <span>{heading}</span>
        <span
          aria-hidden="true"
          className={`text-[10px] leading-none transition-transform duration-150 ${
            showItems ? "rotate-90" : ""
          }`}
        >
          ▸
        </span>
      </button>
      {showItems ? (
        <ul className="mt-2 space-y-1">
          {items.map((item) => {
            const isActive = isItemActive(item.href, pathname);
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
      ) : null}
    </div>
  );
}
