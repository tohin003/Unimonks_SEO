import type { MetadataRoute } from "next";

import { locations } from "@/lib/locations";
import { getPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  const buildDate = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "", priority: 1 },
    { path: "/enroll", priority: 0.9 },
    { path: "/hub", priority: 0.8 },
    { path: "/blog", priority: 0.8 },
  ].map(({ path, priority }) => ({
    url: `${siteConfig.siteUrl}${path}`,
    lastModified: buildDate,
    changeFrequency: "weekly",
    priority,
  }));

  const locationRoutes: MetadataRoute.Sitemap = locations.map((location) => ({
    url: `${siteConfig.siteUrl}/cuet-coaching-in-${location.slug}`,
    lastModified: buildDate,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const articleRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.siteUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.date),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...locationRoutes, ...articleRoutes];
}
