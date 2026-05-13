import type { Metadata } from "next";

import { getAdminContext } from "@/lib/auth/current-user";
import { listAdminUsers } from "@/lib/content/users";
import { isDbConfigured } from "@/lib/db/client";

import { UsersEditor } from "./users-editor";

export const metadata: Metadata = { title: "Users" };

export default async function AdminUsersPage() {
  const ctx = await getAdminContext();
  const users = await listAdminUsers();

  return (
    <div className="space-y-6">
      <header>
        <span className="eyebrow">Account · Users</span>
        <h1 className="mt-5 font-headline text-4xl leading-tight text-primary md:text-5xl">
          Manage admin accounts.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          Owners can invite new editors, change roles, and revoke access. The
          owner accounts are seeded once from{" "}
          <code className="font-mono text-xs">ADMIN_BOOTSTRAP_*</code> env vars
          on first deploy; everyone else is added here.
        </p>
      </header>

      <UsersEditor
        users={users}
        isOwner={ctx.user?.role === "owner"}
        currentUserId={ctx.user?.id ?? null}
        dbConfigured={isDbConfigured()}
      />
    </div>
  );
}
