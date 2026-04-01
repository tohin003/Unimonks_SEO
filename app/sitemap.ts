import type { MetadataRoute } from "next";

import { getPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  const staticRoutes: MetadataRoute.Sitemap = ["", "/enroll", "/hub", "/blog"].map(
    (path) => ({
      url: `${siteConfig.siteUrl}${path}`,
      lastModified: new Date("2026-04-01"),
      changeFrequency: "weekly",
      priority: path === "" ? 1 : 0.8,
    }),
  );

  const articleRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes];
}
