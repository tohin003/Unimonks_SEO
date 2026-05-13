"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { AdminPanel } from "@/app/admin/_components/admin-panel";
import { TextInput } from "@/app/admin/_components/inputs/text-input";
import { SavePanel } from "@/app/admin/_components/save-panel";
import { StatusBanner } from "@/app/admin/_components/status-banner";
import {
  createUserAction,
  deleteUserAction,
  updateUserRoleAction,
  type CreateUserInput,
} from "@/app/admin/_actions/users";
import type { AdminUserSummary } from "@/lib/content/users";

type EditorProps = {
  users: (Omit<AdminUserSummary, "createdAt" | "lastLoginAt"> & {
    createdAt: string | Date;
    lastLoginAt: string | Date | null;
  })[];
  isOwner: boolean;
  currentUserId: string | null;
  dbConfigured: boolean;
};

type Status = {
  variant: "success" | "error" | "info" | "warning";
  message: string;
};

const emptyForm: CreateUserInput = {
  email: "",
  name: "",
  password: "",
  role: "editor",
};

export function UsersEditor({
  users,
  isOwner,
  currentUserId,
  dbConfigured,
}: EditorProps) {
  const router = useRouter();
  const [form, setForm] = useState<CreateUserInput>(emptyForm);
  const [status, setStatus] = useState<Status | null>(
    dbConfigured
      ? null
      : {
          variant: "warning",
          message:
            "DATABASE_URL is not configured. User management is read-only until Neon is provisioned.",
        },
  );
  const [isPending, startTransition] = useTransition();

  async function handleCreate() {
    setStatus(null);
    startTransition(async () => {
      const result = await createUserAction(form);
      if (result.ok) {
        setForm(emptyForm);
        setStatus({
          variant: "success",
          message: result.message ?? "User created.",
        });
        router.refresh();
      } else {
        setStatus({ variant: "error", message: result.message });
      }
    });
  }

  async function changeRole(id: string, role: "owner" | "editor") {
    setStatus(null);
    startTransition(async () => {
      const result = await updateUserRoleAction({ id, role });
      if (result.ok) {
        setStatus({
          variant: "success",
          message: result.message ?? "Role updated.",
        });
        router.refresh();
      } else {
        setStatus({ variant: "error", message: result.message });
      }
    });
  }

  async function removeUser(id: string) {
    if (!window.confirm("Remove this user? Their sessions are revoked.")) {
      return;
    }
    setStatus(null);
    startTransition(async () => {
      const result = await deleteUserAction(id);
      if (result.ok) {
        setStatus({
          variant: "success",
          message: result.message ?? "User removed.",
        });
        router.refresh();
      } else {
        setStatus({ variant: "error", message: result.message });
      }
    });
  }

  return (
    <div className="space-y-6">
      {status ? (
        <StatusBanner variant={status.variant} message={status.message} />
      ) : null}

      <AdminPanel eyebrow="Roster" title="Current admin accounts">
        {users.length === 0 ? (
          <p className="text-sm text-slate-600">
            No users yet. Run <code className="font-mono">npm run db:seed</code>{" "}
            after provisioning Neon to bootstrap the first owner, or use the
            form below.
          </p>
        ) : (
          <ul className="space-y-3">
            {users.map((user) => {
              const created = new Date(user.createdAt);
              const lastLogin = user.lastLoginAt
                ? new Date(user.lastLoginAt)
                : null;
              const isSelf = user.id === currentUserId;
              return (
                <li
                  key={user.id}
                  className="rounded-2xl border border-slate-200 bg-white/70 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-primary">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        Joined {created.toLocaleDateString("en-IN")} ·{" "}
                        {lastLogin
                          ? `last seen ${lastLogin.toLocaleDateString("en-IN")}`
                          : "no login yet"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={user.role}
                        onChange={(event) =>
                          changeRole(
                            user.id,
                            event.target.value === "owner" ? "owner" : "editor",
                          )
                        }
                        disabled={!isOwner || isSelf || isPending}
                        className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="editor">Editor</option>
                        <option value="owner">Owner</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeUser(user.id)}
                        disabled={!isOwner || isSelf || isPending}
                        className="rounded-full border border-rose-200 px-3 py-1.5 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSelf ? "You" : "Remove"}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </AdminPanel>

      {isOwner ? (
        <AdminPanel
          eyebrow="Invite"
          title="Create a new admin user"
          description="Share the temp password securely. The user can change it once they sign in."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="Name"
              value={form.name}
              onChange={(name) => setForm((f) => ({ ...f, name }))}
              required
            />
            <TextInput
              label="Email"
              value={form.email}
              onChange={(email) => setForm((f) => ({ ...f, email }))}
              required
              type="email"
            />
            <TextInput
              label="Temporary password"
              value={form.password}
              onChange={(password) => setForm((f) => ({ ...f, password }))}
              required
              helpText="Minimum 8 characters."
            />
            <label className="block text-sm font-medium text-slate-700">
              <span className="mb-2 block">Role</span>
              <select
                value={form.role}
                onChange={(event) =>
                  setForm((f) => ({
                    ...f,
                    role:
                      event.target.value === "owner" ? "owner" : "editor",
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              >
                <option value="editor">Editor</option>
                <option value="owner">Owner</option>
              </select>
            </label>
          </div>
          <SavePanel
            isPending={isPending}
            dirty={form.name.length > 0 && form.email.length > 0 && form.password.length >= 8}
            onSave={handleCreate}
            saveLabel="Create user"
          />
        </AdminPanel>
      ) : (
        <StatusBanner
          variant="info"
          message="Only the owner role can invite new admins or change roles."
        />
      )}
    </div>
  );
}
