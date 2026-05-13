import Image, { type ImageProps } from "next/image";

type MediaFrameVariant = "panel" | "ring" | "bare";

type MediaFrameProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** CSS aspect-ratio expression (e.g. "21 / 9", "4 / 5"). */
  ratio: string;
  /** `panel` reuses the .panel chrome; `ring` adds a slate-200/80 inner ring suited to portraits; `bare` leaves the container minimal. */
  variant?: MediaFrameVariant;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** Optional caption rendered beneath the image inside a <figure>. */
  caption?: string | null;
} & Pick<ImageProps, "loading" | "fetchPriority">;

const variantClass: Record<MediaFrameVariant, string> = {
  panel:
    "overflow-hidden rounded-[28px] bg-slate-100 panel shadow-[0_24px_70px_-40px_rgba(15,23,42,0.35)]",
  ring:
    "overflow-hidden rounded-[24px] bg-slate-100 ring-1 ring-slate-200/80",
  bare: "overflow-hidden rounded-[20px] bg-slate-100",
};

/**
 * Shared image surface for every editable photo on the site. Always
 * reserves the aspect ratio so layout shift stays at zero. Pass
 * `variant="ring"` for portraits and `variant="panel"` for hero / cover
 * surfaces that should match the site's text-card chrome.
 */
export function MediaFrame({
  src,
  alt,
  width,
  height,
  ratio,
  variant = "panel",
  priority,
  sizes,
  className,
  caption,
  loading,
  fetchPriority,
}: MediaFrameProps) {
  const frame = (
    <div
      className={`${variantClass[variant]} ${className ?? ""}`.trim()}
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        loading={loading}
        fetchPriority={fetchPriority}
        className="h-full w-full object-cover"
      />
    </div>
  );

  if (caption) {
    return (
      <figure className="space-y-3">
        {frame}
        <figcaption className="text-sm leading-7 text-slate-500">
          {caption}
        </figcaption>
      </figure>
    );
  }

  return frame;
}
