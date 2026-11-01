const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

function getSiteUrl(value: string | undefined) {
  if (!value) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("NEXT_PUBLIC_SITE_URL must be configured in production.");
    }
    return undefined;
  }

  const parsed = new URL(value);
  if (process.env.NODE_ENV === "production" && parsed.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS in production.");
  }
  if (parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be a clean origin URL.");
  }
  if (parsed.pathname !== "/") {
    throw new Error("NEXT_PUBLIC_SITE_URL must not include a path.");
  }
  return parsed.origin;
}

export const seoConfig = {
  name: "Labs",
  description:
    "Learn SQL and MongoDB through interactive database labs, beginner guides, and hands-on query practice for students and developers.",
  defaultTitle: "Learn SQL and MongoDB with Hands-on Database Labs",
  siteUrl: getSiteUrl(configuredSiteUrl),
} as const;

export function absoluteUrl(path: string) {
  if (!seoConfig.siteUrl) return undefined;
  return new URL(path, seoConfig.siteUrl).toString();
}

export function pageMetadata(title: string, description: string, path: string, type: "website" | "article" = "website") {
  const url = absoluteUrl(path);
  const image = absoluteUrl("/opengraph-image") ?? "/opengraph-image";

  return {
    title,
    description,
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: {
      type,
      siteName: seoConfig.name,
      title: `${title} | Labs`,
      description,
      ...(url ? { url } : {}),
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" as const, title: `${title} | Labs`, description, images: [image] },
  };
}
