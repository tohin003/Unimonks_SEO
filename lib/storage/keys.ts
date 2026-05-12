import { randomUUID } from "node:crypto";

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

export function generateMediaKey(scope: string, mimeType: string): string {
  const ext = EXT_BY_MIME[mimeType] ?? "bin";
  const id = randomUUID();
  const date = new Date();
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const safeScope = scope.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  return `${safeScope}/${yyyy}/${mm}/${id}.${ext}`;
}
