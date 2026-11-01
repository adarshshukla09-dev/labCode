import { seoConfig } from "@/lib/seo";

export function SiteJsonLd() {
  const organizationId = seoConfig.siteUrl ? `${seoConfig.siteUrl}/#organization` : undefined;
  const websiteId = seoConfig.siteUrl ? `${seoConfig.siteUrl}/#website` : undefined;
  const graph = [
    {
      "@type": "Organization",
      ...(organizationId ? { "@id": organizationId, url: seoConfig.siteUrl } : {}),
      name: seoConfig.name,
      ...(seoConfig.siteUrl ? { logo: `${seoConfig.siteUrl}/apple-icon` } : {}),
    },
    {
      "@type": "WebSite",
      ...(websiteId ? { "@id": websiteId } : {}),
      name: seoConfig.name,
      description: seoConfig.description,
      ...(seoConfig.siteUrl ? { url: seoConfig.siteUrl } : {}),
      ...(organizationId ? { publisher: { "@id": organizationId } } : {}),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c") }}
    />
  );
}
