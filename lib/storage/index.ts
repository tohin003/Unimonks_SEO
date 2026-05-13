import { localStorage } from "@/lib/storage/local";
import { isR2Configured, r2Storage } from "@/lib/storage/r2";
import type {
  PutObjectInput,
  SignedPutInput,
  SignedPutResult,
  Storage,
} from "@/lib/storage/types";

export type { Storage } from "@/lib/storage/types";

const STORAGE_NOT_CONFIGURED_MESSAGE =
  "Storage is not configured. Set R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET / R2_PUBLIC_BASE_URL in the Vercel project to enable uploads in production.";

/**
 * Stand-in driver used when no R2 credentials are set AND we are running on
 * a read-only filesystem (Vercel). Every write surface throws a clean,
 * human-readable error so the admin UI can present a configuration banner
 * instead of crashing in the React Server Components renderer.
 */
const disabledStorage: Storage = {
  driver: "local",
  async put(_input: PutObjectInput): Promise<{ publicUrl: string }> {
    throw new Error(STORAGE_NOT_CONFIGURED_MESSAGE);
  },
  async signedPut(_input: SignedPutInput): Promise<SignedPutResult> {
    throw new Error(STORAGE_NOT_CONFIGURED_MESSAGE);
  },
  async delete(_key: string): Promise<void> {
    throw new Error(STORAGE_NOT_CONFIGURED_MESSAGE);
  },
  publicUrl(_key: string): string {
    return "";
  },
};

function isVercelRuntime(): boolean {
  return Boolean(process.env.VERCEL);
}

/**
 * Returns the active storage driver:
 *   1. R2 — when all R2_* env vars are set (production or local).
 *   2. Local filesystem — when running outside Vercel (local dev).
 *   3. Disabled — on Vercel without R2 config. Uploads fail with a clear
 *      message rather than crashing on EROFS from public/uploads/.
 */
export function getStorage(): Storage {
  if (isR2Configured()) return r2Storage;
  if (isVercelRuntime()) return disabledStorage;
  return localStorage;
}

export function isProductionStorage(): boolean {
  return isR2Configured();
}

export function isStorageWritable(): boolean {
  return isR2Configured() || !isVercelRuntime();
}

