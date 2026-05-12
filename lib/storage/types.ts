export type StorageDriver = "r2" | "local";

export type PutObjectInput = {
  key: string;
  contentType: string;
  body: Buffer | Uint8Array;
};

export type SignedPutInput = {
  key: string;
  contentType: string;
  contentLength?: number;
  expiresInSeconds?: number;
};

export type SignedPutResult = {
  uploadUrl: string;
  publicUrl: string;
  headers?: Record<string, string>;
};

/**
 * Storage interface implemented by both the R2 driver (production) and the
 * local-filesystem driver (development). All admin upload code paths talk
 * to this interface, never to the underlying driver directly, so the swap
 * at production cutover requires zero code changes.
 */
export interface Storage {
  readonly driver: StorageDriver;
  put(input: PutObjectInput): Promise<{ publicUrl: string }>;
  signedPut(input: SignedPutInput): Promise<SignedPutResult>;
  delete(key: string): Promise<void>;
  publicUrl(key: string): string;
}
