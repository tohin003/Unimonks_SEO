import { localStorage } from "@/lib/storage/local";
import { isR2Configured, r2Storage } from "@/lib/storage/r2";
import type { Storage } from "@/lib/storage/types";

export type { Storage } from "@/lib/storage/types";

/**
 * Returns the active storage driver. R2 in production (when R2_* env vars
 * are present), local filesystem otherwise.
 */
export function getStorage(): Storage {
  if (isR2Configured()) {
    return r2Storage;
  }
  return localStorage;
}

export function isProductionStorage(): boolean {
  return isR2Configured();
}
