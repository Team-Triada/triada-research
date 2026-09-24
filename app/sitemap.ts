import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const tags = getAllTags();
  const latest = posts[0]?.date;

  return [
    { url: SITE_URL, lastModified: latest, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/research`, lastModified: latest, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/tags`, changeFrequency: "weekly", priority: 0.5 },
    ...tags.map(({ tag }) => ({
      url: `${SITE_URL}/tags/${tag}`,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/${post.slug}`,
      lastModified: post.date,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
