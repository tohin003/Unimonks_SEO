"use client";

import { useCallback, useEffect, useId, useMemo, useState, useTransition } from "react";

import {
  finalizeUploadAction,
  listMediaForPickerAction,
  requestUploadAction,
} from "@/app/admin/_actions/media";
import type { MediaAsset } from "@/lib/content/media";

export type PickedAsset = {
  assetId: string;
  publicUrl: string;
  alt: string;
  width: number;
  height: number;
};

type ImagePickerProps = {
  label: string;
  value: PickedAsset | null;
  onChange: (next: PickedAsset | null) => void;
  helpText?: string;
  /** Aspect of the preview tile. Defaults to 4:3. */
  previewAspect?: string;
  /** Scope for new uploads (folder prefix in storage). */
  uploadScope?: string;
  required?: boolean;
};

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

export function ImagePicker({
  label,
  value,
  onChange,
  helpText,
  previewAspect = "4 / 3",
  uploadScope = "media",
  required,
}: ImagePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {label}
          {required ? <span className="ml-1 text-rose-500">*</span> : null}
        </span>
        {value ? (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 hover:text-rose-600"
          >
            Clear
          </button>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex w-full flex-col gap-3 rounded-3xl border border-dashed border-slate-300 bg-white/60 p-3 text-left transition-colors hover:border-primary"
      >
        <div
          className="relative w-full overflow-hidden rounded-2xl bg-slate-100"
          style={{ aspectRatio: previewAspect }}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value.publicUrl}
              alt={value.alt || ""}
              width={value.width}
              height={value.height}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
              No image selected
            </div>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span className="font-semibold uppercase tracking-[0.18em] text-primary group-hover:underline">
            {value ? "Replace image" : "Choose image"}
          </span>
          {value ? (
            <span className="font-mono text-[10px] text-slate-400">
              {value.width}×{value.height}
            </span>
          ) : null}
        </div>
      </button>
      {helpText ? <p className="text-xs leading-5 text-slate-500">{helpText}</p> : null}
      {open ? (
        <PickerModal
          uploadScope={uploadScope}
          onClose={() => setOpen(false)}
          onPick={(asset) => {
            onChange({
              assetId: asset.id,
              publicUrl: asset.publicUrl,
              alt: asset.altText,
              width: asset.width,
              height: asset.height,
            });
            setOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}

type PickerModalProps = {
  uploadScope: string;
  onClose: () => void;
  onPick: (asset: MediaAsset) => void;
};

function PickerModal({ uploadScope, onClose, onPick }: PickerModalProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, startUpload] = useTransition();
  const fileInputId = useId();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listMediaForPickerAction()
      .then((rows) => {
        if (!cancelled) setAssets(rows);
      })
      .catch((error) => {
        console.error("[image-picker] list failed", error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return assets;
    return assets.filter((asset) => {
      const filename = asset.storageKey.toLowerCase();
      const alt = asset.altText.toLowerCase();
      return filename.includes(needle) || alt.includes(needle);
    });
  }, [assets, query]);

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const file = Array.from(files)[0];
      if (!file) return;
      setUploadError(null);
      startUpload(async () => {
        try {
          const dims = await readImageDimensions(file);
          const req = await requestUploadAction({
            filename: file.name,
            mimeType: file.type,
            fileSize: file.size,
            scope: uploadScope,
          });
          if (!req.ok) throw new Error(req.message);

          const putResponse = await fetch(req.uploadUrl, {
            method: "PUT",
            headers: req.headers ?? { "Content-Type": file.type },
            body: file,
          });
          if (!putResponse.ok) {
            throw new Error(`Upload PUT failed (${putResponse.status}).`);
          }

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
          const newAsset: MediaAsset = {
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
          };
          setAssets((prev) => [newAsset, ...prev]);
          onPick(newAsset);
        } catch (error) {
          setUploadError(error instanceof Error ? error.message : "Upload failed.");
        }
      });
    },
    [onPick, uploadScope],
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pick an image"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="panel flex h-[min(86vh,720px)] w-full max-w-4xl flex-col overflow-hidden p-0">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="eyebrow">Media library</p>
            <h2 className="font-headline text-xl text-primary">Pick an image</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-primary hover:text-primary"
          >
            Close
          </button>
        </header>
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-5 py-3">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search filename or alt text"
            className="min-w-[12rem] flex-1 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none"
          />
          <label
            htmlFor={fileInputId}
            className={`rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-on-primary transition-transform hover:-translate-y-0.5 ${
              isUploading ? "pointer-events-none opacity-60" : "cursor-pointer"
            }`}
          >
            {isUploading ? "Uploading…" : "Upload new"}
          </label>
          <input
            id={fileInputId}
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={isUploading}
            onChange={(event) => {
              if (event.target.files?.length) {
                handleFiles(event.target.files);
                event.target.value = "";
              }
            }}
          />
        </div>
        {uploadError ? (
          <p
            role="alert"
            className="border-b border-rose-200 bg-rose-50 px-5 py-2 text-xs leading-6 text-rose-800"
          >
            {uploadError}
          </p>
        ) : null}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <p className="text-center text-sm text-slate-500">Loading library…</p>
          ) : assets.length === 0 ? (
            <p className="text-center text-sm leading-7 text-slate-500">
              No images uploaded yet. Use &ldquo;Upload new&rdquo; above to add one.
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-sm leading-7 text-slate-500">
              No images match &ldquo;{query}&rdquo;.
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((asset) => {
                const filename = asset.storageKey.split("/").pop() ?? asset.storageKey;
                return (
                  <li key={asset.id}>
                    <button
                      type="button"
                      onClick={() => onPick(asset)}
                      className="group flex w-full flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-2 text-left transition-colors hover:border-primary"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
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
                      <div className="space-y-0.5 text-[11px] leading-4 text-slate-600">
                        <p className="truncate font-mono text-slate-500" title={asset.storageKey}>
                          {filename}
                        </p>
                        <p className="truncate text-slate-400">
                          {asset.altText || "No alt text"}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
