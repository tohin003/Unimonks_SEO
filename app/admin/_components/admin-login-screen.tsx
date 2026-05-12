"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Logo } from "@/components/logo";

type AdminLoginScreenProps = {
  authMode: "db" | "legacy" | "open";
};

export function AdminLoginScreen({ authMode }: AdminLoginScreenProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const payload =
      authMode === "db" ? { email, password } : { password };

    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json().catch(() => null)) as
      | { ok?: boolean; message?: string }
      | null;

    if (!response.ok || !data?.ok) {
      setError(data?.message ?? "Sign in failed.");
      return;
    }

    setEmail("");
    setPassword("");
    startTransition(() => router.refresh());
  }

  return (
    <div className="admin-shell flex min-h-screen items-center justify-center px-6 py-16">
      <div className="panel w-full max-w-md p-8 md:p-10">
        <div className="flex items-center justify-between gap-4">
          <Logo />
          <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
            Admin
          </span>
        </div>
        <h1 className="mt-8 font-headline text-4xl leading-tight text-primary">
          Sign in to the admin.
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          {authMode === "db"
            ? "Use your UNIMONKS admin email and password."
            : "Enter the owner password set in the project environment."}
        </p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {authMode === "db" ? (
            <label className="block text-sm font-medium text-slate-700">
              <span className="mb-2 block">Email</span>
              <input
                required
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              />
            </label>
          ) : null}
          <label className="block text-sm font-medium text-slate-700">
            <span className="mb-2 block">Password</span>
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            />
          </label>
          {error ? (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
