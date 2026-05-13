"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = { initial: boolean };

export function EditModeToggle({ initial }: Props) {
  const router = useRouter();
  const [on, setOn] = useState(initial);
  const [isPending, startTransition] = useTransition();

  async function toggle() {
    const next = !on;
    setOn(next);
    await fetch("/api/admin/edit-mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ on: next }),
    });
    startTransition(() => router.refresh());
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-pressed={on}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${
        on
          ? "bg-primary text-on-primary hover:-translate-y-0.5"
          : "border border-slate-300 text-slate-700 hover:border-primary hover:text-primary"
      }`}
    >
      {isPending ? "…" : on ? "Exit edit mode" : "Enter edit mode"}
    </button>
  );
}
