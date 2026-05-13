"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getAdminContext } from "@/lib/auth/current-user";
import { getDb } from "@/lib/db/client";
import { imageShowcaseSlides } from "@/lib/db/schema";

import { recordAudit } from "./audit";
import {
  dbNotConfigured,
  notAuthenticated,
  type ActionResult,
} from "./types";

const SlideSchema = z.object({
  assetId: z.string().uuid("Pick an image for every slide"),
  headline: z.string().min(1, "Headline is required").max(120),
  subhead: z.string().max(200).optional().nullable(),
  linkUrl: z
    .string()
    .max(500)
    .refine(
      (value) =>
        !value || /^https?:\/\//i.test(value) || value.startsWith("/"),
      { message: "Link must be a full URL or start with /" },
    )
    .optional()
    .nullable(),
  enabled: z.boolean().default(true),
});

export const ShowcaseSlidesInputSchema = z.array(SlideSchema).max(24);

export type ShowcaseSlideInput = z.infer<typeof SlideSchema>;
export type ShowcaseSlidesInput = z.infer<typeof ShowcaseSlidesInputSchema>;

export async function saveShowcaseSlidesAction(
  input: ShowcaseSlidesInput,
): Promise<ActionResult> {
  const ctx = await getAdminContext();
  if (!ctx.authenticated) return notAuthenticated();
  const db = getDb();
  if (!db) return dbNotConfigured();

  const parsed = ShowcaseSlidesInputSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { ok: false, message: "Some fields are invalid.", fieldErrors };
  }

  try {
    const before = await db.select().from(imageShowcaseSlides);
    await db.delete(imageShowcaseSlides);

    if (parsed.data.length > 0) {
      await db.insert(imageShowcaseSlides).values(
        parsed.data.map((slide, index) => ({
          assetId: slide.assetId,
          headline: slide.headline,
          subhead: slide.subhead && slide.subhead.length > 0 ? slide.subhead : null,
          linkUrl: slide.linkUrl && slide.linkUrl.length > 0 ? slide.linkUrl : null,
          enabled: slide.enabled ? 1 : 0,
          position: index,
        })),
      );
    }

    const after = await db.select().from(imageShowcaseSlides);

    await recordAudit({
      user: ctx.user,
      action: "update",
      entityType: "image_showcase_slides",
      entityId: "all",
      before,
      after,
    });

    revalidatePath("/");
    revalidatePath("/admin/showcase");

    return {
      ok: true,
      message: "Showcase saved. The home page will refresh shortly.",
    };
  } catch (error) {
    console.error("[admin] saveShowcaseSlidesAction failed", error);
    return { ok: false, message: "Could not save the showcase." };
  }
}
