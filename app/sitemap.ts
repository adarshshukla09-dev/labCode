import type { MetadataRoute } from "next";
import { seoConfig } from "@/lib/seo";
import { learnArticles } from "@/lib/learn-articles";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!seoConfig.siteUrl) return [];

  return [
    { url: seoConfig.siteUrl },
    { url: `${seoConfig.siteUrl}/lab` },
    { url: `${seoConfig.siteUrl}/lab/sql` },
    { url: `${seoConfig.siteUrl}/lab/mongodb` },
    { url: `${seoConfig.siteUrl}/Learn` },
    ...learnArticles.map((article) => ({
      url: `${seoConfig.siteUrl}/Learn/${article.slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
  ];
}
