"use client";

import { useMemo, useState, useTransition } from "react";

import { saveShowcaseSlidesAction } from "@/app/admin/_actions/showcase";
import { ImagePicker } from "@/app/admin/_components/inputs/image-picker";
import { RepeatableGroup } from "@/app/admin/_components/inputs/repeatable-group";
import { TextInput } from "@/app/admin/_components/inputs/text-input";
import { TextareaInput } from "@/app/admin/_components/inputs/textarea-input";
import { SavePanel } from "@/app/admin/_components/save-panel";
import { StatusBanner } from "@/app/admin/_components/status-banner";

export type ShowcaseSlideForm = {
  assetId: string;
  publicUrl: string;
  alt: string;
  width: number;
  height: number;
  headline: string;
  subhead: string;
  linkUrl: string;
  enabled: boolean;
};

type EditorProps = {
  initialSlides: ShowcaseSlideForm[];
  dbConfigured: boolean;
};

type Status = { variant: "success" | "error" | "info" | "warning"; message: string };

function blankSlide(): ShowcaseSlideForm {
  return {
    assetId: "",
    publicUrl: "",
    alt: "",
    width: 0,
    height: 0,
    headline: "",
    subhead: "",
    linkUrl: "",
    enabled: true,
  };
}

export function ShowcaseEditor({ initialSlides, dbConfigured }: EditorProps) {
  const [slides, setSlides] = useState<ShowcaseSlideForm[]>(initialSlides);
  const [saved, setSaved] = useState<ShowcaseSlideForm[]>(initialSlides);
  const [status, setStatus] = useState<Status | null>(
    dbConfigured
      ? null
      : {
          variant: "warning",
          message:
            "DATABASE_URL is not configured. Save is disabled until Neon is provisioned.",
        },
  );
  const [isPending, startTransition] = useTransition();

  const dirty = useMemo(
    () => JSON.stringify(slides) !== JSON.stringify(saved),
    [slides, saved],
  );

  const missingAssets = slides.filter((slide) => !slide.assetId).length;

  function handleSave() {
    if (missingAssets > 0) {
      setStatus({
        variant: "error",
        message: `Pick an image for ${missingAssets} slide${missingAssets === 1 ? "" : "s"} before saving.`,
      });
      return;
    }
    setStatus(null);
    startTransition(async () => {
      const result = await saveShowcaseSlidesAction(
        slides.map((slide) => ({
          assetId: slide.assetId,
          headline: slide.headline,
          subhead: slide.subhead.trim() ? slide.subhead : null,
          linkUrl: slide.linkUrl.trim() ? slide.linkUrl : null,
          enabled: slide.enabled,
        })),
      );
      if (result.ok) {
        setSaved(slides);
        setStatus({
          variant: "success",
          message: result.message ?? "Showcase saved.",
        });
      } else {
        setStatus({ variant: "error", message: result.message });
      }
    });
  }

  return (
    <div className="space-y-6">
      <RepeatableGroup<ShowcaseSlideForm>
        label="Showcase slides"
        values={slides}
        onChange={setSlides}
        createNew={blankSlide}
        itemLabel="Slide"
        itemSummary={(slide) =>
          slide.headline ||
          (slide.assetId ? "Untitled slide" : "Pick an image to start")
        }
        emptyMessage="No slides yet. Add one to start the carousel."
        renderItem={({ value, onChange }) => (
          <div className="space-y-4">
            <ImagePicker
              label="Slide image"
              required
              uploadScope="showcase"
              previewAspect="4 / 5"
              helpText="Portrait images render best. 4:5 or 3:4 ratio recommended."
              value={
                value.assetId
                  ? {
                      assetId: value.assetId,
                      publicUrl: value.publicUrl,
                      alt: value.alt,
                      width: value.width,
                      height: value.height,
                    }
                  : null
              }
              onChange={(picked) =>
                onChange(
                  picked
                    ? {
                        ...value,
                        assetId: picked.assetId,
                        publicUrl: picked.publicUrl,
                        alt: picked.alt,
                        width: picked.width,
                        height: picked.height,
                      }
                    : {
                        ...value,
                        assetId: "",
                        publicUrl: "",
                        alt: "",
                        width: 0,
                        height: 0,
                      },
                )
              }
            />
            <TextInput
              label="Headline"
              value={value.headline}
              onChange={(headline) => onChange({ ...value, headline })}
              required
              placeholder="e.g. From classroom to Hindu College."
            />
            <TextareaInput
              label="Subhead (optional)"
              value={value.subhead}
              onChange={(subhead) => onChange({ ...value, subhead })}
              rows={2}
              placeholder="One line of supporting context."
            />
            <TextInput
              label="Link URL (optional)"
              value={value.linkUrl}
              onChange={(linkUrl) => onChange({ ...value, linkUrl })}
              type="text"
              placeholder="https://… or /some-path"
              helpText="When set, the entire card becomes a clickable link."
            />
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
              <input
                type="checkbox"
                checked={value.enabled}
                onChange={(event) =>
                  onChange({ ...value, enabled: event.target.checked })
                }
                className="h-4 w-4 rounded border-slate-400 text-primary focus:ring-primary"
              />
              <span>
                <span className="block font-semibold text-slate-800">
                  Enabled on the live site
                </span>
                <span className="block text-xs text-slate-500">
                  Disable to keep the slide in draft without showing it.
                </span>
              </span>
            </label>
          </div>
        )}
      />
      {status ? (
        <StatusBanner variant={status.variant} message={status.message} />
      ) : null}
      <SavePanel
        isPending={isPending}
        dirty={dirty}
        onSave={handleSave}
        onDiscard={() => setSlides(saved)}
      />
    </div>
  );
}
