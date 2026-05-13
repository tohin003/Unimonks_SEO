"use client";

import { useCallback, useId, useMemo, useRef, useState, useTransition } from "react";

import {
  finalizeUploadAction,
  requestUploadAction,
  softDeleteMediaAction,
  updateMediaAssetAction,
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
            "DATABASE_URL is not configured. Uploads and edits are disabled until Neon is provisioned.",
        },
  );
  const [isDragging, setDragging] = useState(false);
  const [isDeleting, startDelete] = useTransition();
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fileInputId = useId();

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return assets;
    return assets.filter((asset) => {
      const filename = asset.storageKey.toLowerCase();
      const alt = asset.altText.toLowerCase();
      const title = (asset.title ?? "").toLowerCase();
      return (
        filename.includes(needle) || alt.includes(needle) || title.includes(needle)
      );
    });
  }, [assets, query]);

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

  function handleAssetUpdate(updated: MediaAsset) {
    setAssets((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span className="font-headline text-xl text-primary">
            {assets.length === 0 ? "Library is empty" : `${assets.length} image${assets.length === 1 ? "" : "s"}`}
          </span>
          {query.trim() ? (
            <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
              {filtered.length} match{filtered.length === 1 ? "" : "es"}
            </span>
          ) : null}
        </div>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search filename or alt text"
          className="w-full max-w-xs rounded-full border border-slate-300 bg-white px-4 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none"
        />
      </div>

      {assets.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center text-sm leading-7 text-slate-500">
          No images yet. Drop a few above to get started.
        </p>
      ) : filtered.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-slate-300 bg-white/60 px-6 py-10 text-center text-sm leading-7 text-slate-500">
          No images match &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((asset) => (
            <MediaTile
              key={asset.id}
              asset={asset}
              expanded={expandedId === asset.id}
              onToggleExpanded={() =>
                setExpandedId((prev) => (prev === asset.id ? null : asset.id))
              }
              onDelete={() => handleDelete(asset.id)}
              onUpdated={handleAssetUpdate}
              dbConfigured={dbConfigured}
              isDeleting={isDeleting}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

type MediaTileProps = {
  asset: MediaAsset;
  expanded: boolean;
  onToggleExpanded: () => void;
  onDelete: () => void;
  onUpdated: (asset: MediaAsset) => void;
  dbConfigured: boolean;
  isDeleting: boolean;
};

function MediaTile({
  asset,
  expanded,
  onToggleExpanded,
  onDelete,
  onUpdated,
  dbConfigured,
  isDeleting,
}: MediaTileProps) {
  const [altText, setAltText] = useState(asset.altText);
  const [title, setTitle] = useState(asset.title ?? "");
  const [caption, setCaption] = useState(asset.caption ?? "");
  const [tileStatus, setTileStatus] = useState<Status | null>(null);
  const [isPending, startTransition] = useTransition();

  const dirty =
    altText !== asset.altText ||
    title !== (asset.title ?? "") ||
    caption !== (asset.caption ?? "");

  const filename = asset.storageKey.split("/").pop() ?? asset.storageKey;

  function handleSave() {
    setTileStatus(null);
    startTransition(async () => {
      const result = await updateMediaAssetAction(asset.id, {
        altText,
        title: title.trim() ? title : null,
        caption: caption.trim() ? caption : null,
      });
      if (result.ok) {
        onUpdated({
          ...asset,
          altText,
          title: title.trim() ? title : null,
          caption: caption.trim() ? caption : null,
          updatedAt: new Date(),
        });
        setTileStatus({ variant: "success", message: result.message ?? "Saved." });
      } else {
        setTileStatus({ variant: "error", message: result.message });
      }
    });
  }

  return (
    <li className="panel flex flex-col gap-3 overflow-hidden p-3">
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
      <div className="flex-1 space-y-2 text-xs leading-5 text-slate-600">
        <p className="truncate font-mono text-[11px] text-slate-500" title={asset.storageKey}>
          {filename}
        </p>
        <p>
          {asset.width}×{asset.height} ·{" "}
          {formatBytes(asset.fileSize)} ·{" "}
          <span className="font-mono uppercase">{asset.mimeType.split("/").pop()}</span>
        </p>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Alt text
          </span>
          <textarea
            value={altText}
            onChange={(event) => setAltText(event.target.value)}
            rows={2}
            disabled={!dbConfigured || isPending}
            placeholder="Describe the image for screen readers and SEO."
            className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm leading-6 focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>
        {expanded ? (
          <>
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Title (optional)
              </span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                disabled={!dbConfigured || isPending}
                placeholder="Short label used in image sitemap entries."
                className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Caption (optional)
              </span>
              <textarea
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                rows={2}
                disabled={!dbConfigured || isPending}
                placeholder="Caption rendered below the image where supported."
                className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm leading-6 focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
          </>
        ) : null}
        {tileStatus ? (
          <StatusBanner variant={tileStatus.variant} message={tileStatus.message} />
        ) : null}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={onToggleExpanded}
          className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 hover:text-primary"
        >
          {expanded ? "Less" : "More details"}
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting || isPending}
            className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 transition-colors hover:border-rose-400 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Hide
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!dbConfigured || !dirty || isPending}
            className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-on-primary transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isPending ? "Saving…" : dirty ? "Save" : "Saved"}
          </button>
        </div>
      </div>
    </li>
  );
}
