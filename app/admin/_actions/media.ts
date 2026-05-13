"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAdminContext } from "@/lib/auth/current-user";
import { getDb } from "@/lib/db/client";
import { mediaAssets } from "@/lib/db/schema";
import { getStorage } from "@/lib/storage";
import { generateMediaKey } from "@/lib/storage/keys";

import { recordAudit } from "./audit";
import {
  dbNotConfigured,
  notAuthenticated,
  type ActionResult,
} from "./types";

const MAX_BYTES = 12 * 1024 * 1024; // 12 MB

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
]);

const RequestUploadSchema = z.object({
  filename: z.string().min(1).max(240),
  mimeType: z.string().min(1).max(80),
  fileSize: z.number().int().positive(),
  scope: z.string().min(1).max(40).default("media"),
});

const FinalizeUploadSchema = z.object({
  storageKey: z.string().min(3).max(240),
  publicUrl: z.string().min(1).max(2000),
  storageDriver: z.enum(["r2", "local"]),
  mimeType: z.string().min(1).max(80),
  fileSize: z.number().int().positive(),
  width: z.number().int().positive().max(20000),
  height: z.number().int().positive().max(20000),
  altText: z.string().max(280).optional(),
  title: z.string().max(160).optional(),
});

export type RequestUploadInput = z.infer<typeof RequestUploadSchema>;

export type RequestUploadResult =
  | {
      ok: true;
      driver: "r2" | "local";
      storageKey: string;
      uploadUrl: string;
      publicUrl: string;
      headers?: Record<string, string>;
    }
  | { ok: false; message: string };

export type FinalizeUploadInput = z.infer<typeof FinalizeUploadSchema>;

export type FinalizeUploadResult =
  | { ok: true; id: string; publicUrl: string }
  | { ok: false; message: string };

export async function requestUploadAction(
  input: RequestUploadInput,
): Promise<RequestUploadResult> {
  const ctx = await getAdminContext();
  if (!ctx.authenticated) {
    return { ok: false, message: "Not authenticated." };
  }

  const parsed = RequestUploadSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid request." };
  }

  if (!ALLOWED_MIME.has(parsed.data.mimeType)) {
    return {
      ok: false,
      message: `Unsupported file type: ${parsed.data.mimeType}. Use JPG, PNG, WEBP, AVIF, GIF, or SVG.`,
    };
  }

  if (parsed.data.fileSize > MAX_BYTES) {
    return {
      ok: false,
      message: `File too large (${Math.round(parsed.data.fileSize / 1024 / 1024)} MB). Max 12 MB.`,
    };
  }

  const storage = getStorage();
  const key = generateMediaKey(parsed.data.scope, parsed.data.mimeType);

  try {
    const signed = await storage.signedPut({
      key,
      contentType: parsed.data.mimeType,
      contentLength: parsed.data.fileSize,
    });
    return {
      ok: true,
      driver: storage.driver,
      storageKey: key,
      uploadUrl: signed.uploadUrl,
      publicUrl: signed.publicUrl,
      headers: signed.headers,
    };
  } catch (error) {
    console.error("[admin] requestUploadAction failed", error);
    return { ok: false, message: "Could not prepare upload." };
  }
}

export async function finalizeUploadAction(
  input: FinalizeUploadInput,
): Promise<FinalizeUploadResult> {
  const ctx = await getAdminContext();
  if (!ctx.authenticated) return { ok: false, message: "Not authenticated." };

  const db = getDb();
  if (!db) return { ok: false, message: "DATABASE_URL not configured." };

  const parsed = FinalizeUploadSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid payload." };
  }

  try {
    const inserted = await db
      .insert(mediaAssets)
      .values({
        storageKey: parsed.data.storageKey,
        publicUrl: parsed.data.publicUrl,
        storageDriver: parsed.data.storageDriver,
        mimeType: parsed.data.mimeType,
        fileSize: parsed.data.fileSize,
        width: parsed.data.width,
        height: parsed.data.height,
        altText: parsed.data.altText ?? "",
        title: parsed.data.title ?? null,
        uploadedById: ctx.user?.id ?? null,
      })
      .returning({ id: mediaAssets.id, publicUrl: mediaAssets.publicUrl });

    const row = inserted[0];
    if (!row) {
      return { ok: false, message: "Insert returned no row." };
    }

    await recordAudit({
      user: ctx.user,
      action: "create",
      entityType: "media_asset",
      entityId: row.id,
      after: { storageKey: parsed.data.storageKey, publicUrl: row.publicUrl },
    });

    revalidatePath("/admin/media");

    return { ok: true, id: row.id, publicUrl: row.publicUrl };
  } catch (error) {
    console.error("[admin] finalizeUploadAction failed", error);
    return { ok: false, message: "Could not save asset metadata." };
  }
}

export async function softDeleteMediaAction(id: string): Promise<ActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.authenticated) return notAuthenticated();
  const db = getDb();
  if (!db) return dbNotConfigured();

  if (!id || typeof id !== "string") {
    return { ok: false, message: "Asset id is required." };
  }

  try {
    const updated = await db
      .update(mediaAssets)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(mediaAssets.id, id))
      .returning({ id: mediaAssets.id, storageKey: mediaAssets.storageKey });

    const row = updated[0];
    if (!row) return { ok: false, message: "Asset not found." };

    await recordAudit({
      user: ctx.user,
      action: "delete",
      entityType: "media_asset",
      entityId: row.id,
      after: { deletedAt: new Date().toISOString() },
    });

    revalidatePath("/admin/media");

    return { ok: true, message: "Asset hidden from the library." };
  } catch (error) {
    console.error("[admin] softDeleteMediaAction failed", error);
    return { ok: false, message: "Could not delete asset." };
  }
}
