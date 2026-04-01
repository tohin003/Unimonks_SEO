import { revalidatePath } from "next/cache";

export function revalidateContentPages(slug?: string, previousSlug?: string) {
  revalidatePath("/");
  revalidatePath("/hub");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/sitemap.xml");

  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/blog/${previousSlug}`);
  }
}
