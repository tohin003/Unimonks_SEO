"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAdminContext } from "@/lib/auth/current-user";
import { hashPassword } from "@/lib/auth/passwords";
import { getDb } from "@/lib/db/client";
import { sessions, users } from "@/lib/db/schema";

import { recordAudit } from "./audit";
import {
  dbNotConfigured,
  notAuthenticated,
  type ActionResult,
} from "./types";

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(280),
  password: z.string().min(8).max(120),
  role: z.enum(["owner", "editor"]),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export async function createUserAction(
  input: CreateUserInput,
): Promise<ActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.authenticated) return notAuthenticated();
  if (!ctx.user || ctx.user.role !== "owner") {
    return { ok: false, message: "Only owners can invite new users." };
  }
  const db = getDb();
  if (!db) return dbNotConfigured();

  const parsed = CreateUserSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Some fields are invalid." };
  }

  try {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, parsed.data.email))
      .limit(1);
    if (existing.length > 0) {
      return { ok: false, message: "A user with that email already exists." };
    }

    const passwordHash = await hashPassword(parsed.data.password);
    const inserted = await db
      .insert(users)
      .values({
        email: parsed.data.email,
        name: parsed.data.name,
        passwordHash,
        role: parsed.data.role,
      })
      .returning({ id: users.id });

    await recordAudit({
      user: ctx.user,
      action: "create",
      entityType: "user",
      entityId: inserted[0]?.id ?? parsed.data.email,
      after: { email: parsed.data.email, name: parsed.data.name, role: parsed.data.role },
    });

    revalidatePath("/admin/account/users");

    return { ok: true, message: "User created." };
  } catch (error) {
    console.error("[admin] createUserAction failed", error);
    return { ok: false, message: "Could not create user." };
  }
}

const UpdateRoleSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(["owner", "editor"]),
});

export async function updateUserRoleAction(
  input: z.infer<typeof UpdateRoleSchema>,
): Promise<ActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.authenticated) return notAuthenticated();
  if (!ctx.user || ctx.user.role !== "owner") {
    return { ok: false, message: "Only owners can change roles." };
  }
  const db = getDb();
  if (!db) return dbNotConfigured();

  const parsed = UpdateRoleSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Invalid input." };
  }

  try {
    const before = await db
      .select()
      .from(users)
      .where(eq(users.id, parsed.data.id));

    await db
      .update(users)
      .set({ role: parsed.data.role, updatedAt: new Date() })
      .where(eq(users.id, parsed.data.id));

    await recordAudit({
      user: ctx.user,
      action: "update",
      entityType: "user",
      entityId: parsed.data.id,
      before: before[0],
      after: { role: parsed.data.role },
    });

    revalidatePath("/admin/account/users");

    return { ok: true, message: "Role updated." };
  } catch (error) {
    console.error("[admin] updateUserRoleAction failed", error);
    return { ok: false, message: "Could not update role." };
  }
}

export async function deleteUserAction(id: string): Promise<ActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.authenticated) return notAuthenticated();
  if (!ctx.user || ctx.user.role !== "owner") {
    return { ok: false, message: "Only owners can delete users." };
  }
  if (ctx.user && ctx.user.id === id) {
    return { ok: false, message: "You can't delete your own account." };
  }
  const db = getDb();
  if (!db) return dbNotConfigured();

  try {
    const before = await db.select().from(users).where(eq(users.id, id));
    if (before.length === 0) {
      return { ok: false, message: "User not found." };
    }

    await db.delete(sessions).where(eq(sessions.userId, id));
    await db.delete(users).where(eq(users.id, id));

    await recordAudit({
      user: ctx.user,
      action: "delete",
      entityType: "user",
      entityId: id,
      before: before[0],
    });

    revalidatePath("/admin/account/users");

    return { ok: true, message: "User removed." };
  } catch (error) {
    console.error("[admin] deleteUserAction failed", error);
    return { ok: false, message: "Could not delete user." };
  }
}
