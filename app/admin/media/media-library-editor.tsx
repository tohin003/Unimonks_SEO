"use client";

import { useCallback, useId, useRef, useState, useTransition } from "react";

import {
  finalizeUploadAction,
  requestUploadAction,
  softDeleteMediaAction,
} from "@/app/admin/_actions/media";
import { StatusBanner } from "@/app/admin/_components/status-banner";
import type { MediaAsset } from "@/lib/content/media";

type UploadState = {
  id: string;
  name: string;
  progress: "reading" | "requesting" | "uploading" | "finalizing" | "done" | "error";
  message?: string;
};

type EditorProps = {
  initialAssets: MediaAsset[];
  driver: "r2" | "local";
  dbConfigured: boolean;
};

type Status = { variant: "success" | "error" | "info" | "warning"; message: string };

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    if (file.type === "image/svg+xml") {
      // SVGs may not expose dimensions reliably; pick a square as a placeholder
      // — width/height get overwritten when an admin sets the actual size later.
      resolve({ width: 1000, height: 1000 });
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth || 1, height: img.naturalHeight || 1 });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Could not read dimensions for ${file.name}.`));
    };
    img.src = url;
  });
}

export function MediaLibraryEditor({
  initialAssets,
  driver,
  dbConfigured,
}: EditorProps) {
  const [assets, setAssets] = useState<MediaAsset[]>(initialAssets);
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const [status, setStatus] = useState<Status | null>(
    dbConfigured
      ? null
      : {
          variant: "warning",
          message:
            "DATABASE_URL is not configured. Uploads are disabled until Neon is provisioned.",
        },
  );
  const [isDragging, setDragging] = useState(false);
  const [isDeleting, startDelete] = useTransition();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fileInputId = useId();

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      if (list.length === 0) return;

      for (const file of list) {
        const slot: UploadState = {
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name,
          progress: "reading",
        };
        setUploads((prev) => [...prev, slot]);

        try {
          const dims = await readImageDimensions(file);

          setUploads((prev) =>
            prev.map((u) => (u.id === slot.id ? { ...u, progress: "requesting" } : u)),
          );

          const req = await requestUploadAction({
            filename: file.name,
            mimeType: file.type,
            fileSize: file.size,
            scope: "media",
          });
          if (!req.ok) throw new Error(req.message);

          setUploads((prev) =>
            prev.map((u) => (u.id === slot.id ? { ...u, progress: "uploading" } : u)),
          );

          const putResponse = await fetch(req.uploadUrl, {
            method: "PUT",
            headers: req.headers ?? { "Content-Type": file.type },
            body: file,
          });
          if (!putResponse.ok) {
            throw new Error(`Upload PUT failed (${putResponse.status}).`);
          }

          setUploads((prev) =>
            prev.map((u) => (u.id === slot.id ? { ...u, progress: "finalizing" } : u)),
          );

          const fin = await finalizeUploadAction({
            storageKey: req.storageKey,
            publicUrl: req.publicUrl,
            storageDriver: req.driver,
            mimeType: file.type,
            fileSize: file.size,
            width: dims.width,
            height: dims.height,
            altText: "",
          });
          if (!fin.ok) throw new Error(fin.message);

          const now = new Date();
          setAssets((prev) => [
            {
              id: fin.id,
              storageKey: req.storageKey,
              publicUrl: fin.publicUrl,
              storageDriver: req.driver,
              mimeType: file.type,
              fileSize: file.size,
              width: dims.width,
              height: dims.height,
              altText: "",
              title: null,
              caption: null,
              createdAt: now,
              updatedAt: now,
            },
            ...prev,
          ]);

          setUploads((prev) =>
            prev.map((u) => (u.id === slot.id ? { ...u, progress: "done" } : u)),
          );
        } catch (error) {
          const message = error instanceof Error ? error.message : "Upload failed.";
          setUploads((prev) =>
            prev.map((u) =>
              u.id === slot.id ? { ...u, progress: "error", message } : u,
            ),
          );
        }
      }

      // Drop the "done" entries from the visible list after a short delay so
      // the owner can see the success state without it lingering.
      setTimeout(() => {
        setUploads((prev) => prev.filter((u) => u.progress !== "done"));
      }, 2500);
    },
    [],
  );

  function handleDelete(id: string) {
    if (!confirm("Hide this image from the library? Existing references stay alive.")) {
      return;
    }
    startDelete(async () => {
      const result = await softDeleteMediaAction(id);
      if (result.ok) {
        setAssets((prev) => prev.filter((a) => a.id !== id));
        setStatus({ variant: "success", message: result.message ?? "Asset hidden." });
      } else {
        setStatus({ variant: "error", message: result.message });
      }
    });
  }

  return (
    <div className="space-y-6">
      <label
        htmlFor={fileInputId}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (event.dataTransfer?.files?.length) {
            handleFiles(event.dataTransfer.files);
          }
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-slate-300 bg-white/60 hover:border-primary"
        } ${!dbConfigured ? "pointer-events-none opacity-50" : ""}`}
      >
        <p className="font-headline text-2xl text-primary">Drop images here</p>
        <p className="text-sm leading-7 text-slate-600">
          Or click to select files. JPG, PNG, WEBP, AVIF, GIF, SVG. Max 12 MB
          per file. {driver === "local" ? "Dev uploads land in public/uploads/." : "Production uploads go directly to R2."}
        </p>
        <input
          ref={inputRef}
          id={fileInputId}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          disabled={!dbConfigured}
          onChange={(event) => {
            if (event.target.files?.length) {
              handleFiles(event.target.files);
              event.target.value = "";
            }
          }}
        />
      </label>

      {uploads.length > 0 ? (
        <ul className="space-y-2">
          {uploads.map((u) => (
            <li
              key={u.id}
              className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm ${
                u.progress === "error"
                  ? "border-rose-200 bg-rose-50 text-rose-800"
                  : u.progress === "done"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              <span className="truncate font-medium">{u.name}</span>
              <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em]">
                {u.progress === "error" ? (u.message ?? "Error") : u.progress}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {status ? <StatusBanner variant={status.variant} message={status.message} /> : null}

      {assets.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center text-sm leading-7 text-slate-500">
          No images yet. Drop a few above to get started.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {assets.map((asset) => {
            const filename = asset.storageKey.split("/").pop() ?? asset.storageKey;
            return (
              <li
                key={asset.id}
                className="panel flex flex-col gap-3 overflow-hidden p-3"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.publicUrl}
                    alt={asset.altText || filename}
                    width={asset.width}
                    height={asset.height}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1 text-xs leading-5 text-slate-600">
                  <p className="truncate font-mono text-[11px] text-slate-500" title={asset.storageKey}>
                    {filename}
                  </p>
                  <p>
                    {asset.width}×{asset.height} ·{" "}
                    {formatBytes(asset.fileSize)} ·{" "}
                    <span className="font-mono uppercase">
                      {asset.mimeType.split("/").pop()}
                    </span>
                  </p>
                  <p className="truncate text-slate-400">
                    {asset.altText ? `Alt: ${asset.altText}` : "No alt text yet."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(asset.id)}
                  disabled={isDeleting}
                  className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 transition-colors hover:border-rose-400 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Hide
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
