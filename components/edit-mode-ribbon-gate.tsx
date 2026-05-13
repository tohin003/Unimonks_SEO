"use client";

import { usePathname } from "next/navigation";

/**
 * Hides the floating EditModeRibbon while the visitor is inside the
 * `/admin` shell — there's already an in-shell logout + "View live site"
 * affordance up top, and the ribbon was overlapping every editor's
 * sticky SavePanel.
 */
export function EditModeRibbonGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname && (pathname === "/admin" || pathname.startsWith("/admin/"))) {
    return null;
  }
  return <>{children}</>;
}
