import { promises as fs } from "node:fs";
import path from "node:path";

import type {
  PutObjectInput,
  SignedPutInput,
  SignedPutResult,
  Storage,
} from "@/lib/storage/types";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

function publicPathForKey(key: string) {
  return `/uploads/${key}`;
}

/**
 * Local filesystem driver used in development when no R2 credentials are
 * configured. Uploads are written to `public/uploads/<key>` and served by
 * Next.js as static files. NOT suitable for production on Vercel because
 * the runtime filesystem is read-only — production must use R2.
 */
export const localStorage: Storage = {
  driver: "local",

  async put({ key, body }: PutObjectInput) {
    await ensureUploadDir();
    const buffer = Buffer.isBuffer(body) ? body : Buffer.from(body);
    await fs.writeFile(path.join(UPLOAD_DIR, key), buffer);
    return { publicUrl: publicPathForKey(key) };
  },

  async signedPut({ key }: SignedPutInput): Promise<SignedPutResult> {
    // In local mode the browser does NOT upload directly; the admin code
    // detects the "local" driver and instead calls /api/admin/media/upload
    // with the file body. We still return a synthetic upload URL so callers
    // have a stable shape to work with.
    await ensureUploadDir();
    return {
      uploadUrl: `/api/admin/media/upload?key=${encodeURIComponent(key)}`,
      publicUrl: publicPathForKey(key),
    };
  },

  async delete(key: string) {
    try {
      await fs.unlink(path.join(UPLOAD_DIR, key));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }
  },

  publicUrl(key: string) {
    return publicPathForKey(key);
  },
};
