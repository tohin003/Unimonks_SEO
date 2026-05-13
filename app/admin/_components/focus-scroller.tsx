"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * When the admin editor page is opened with `?focus=<field>`, this component
 * locates a matching wrapper (#field-<field>) and scrolls it into view with a
 * short pulse animation, then removes the marker so subsequent renders stay
 * quiet.
 */
export function FocusScroller() {
  const searchParams = useSearchParams();
  const focus = searchParams.get("focus");

  useEffect(() => {
    if (!focus) return;
    const target = document.getElementById(`field-${focus}`);
    if (!target) return;

    const yOffset = -120;
    const y = target.getBoundingClientRect().top + window.scrollY + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });

    target.setAttribute("data-admin-focus", "true");
    const timer = window.setTimeout(() => {
      target.removeAttribute("data-admin-focus");
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [focus]);

  return null;
}
