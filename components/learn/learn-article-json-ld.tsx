import { absoluteUrl } from "@/lib/seo";
import type { BreadcrumbItem } from "./breadcrumbs";

export function LearnArticleJsonLd({
  title,
  description,
  path,
  breadcrumbs,
}: {
  title: string;
  description: string;
  path: string;
  breadcrumbs: BreadcrumbItem[];
}) {
  const url = absoluteUrl(path);
  const websiteId = absoluteUrl("/#website");
  const organizationId = absoluteUrl("/#organization");
  if (!url) return null;

  const graph = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
      ...(websiteId ? { isPartOf: { "@id": websiteId } } : {}),
      mainEntity: { "@id": `${url}#article` },
    },
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: title,
      description,
      mainEntityOfPage: { "@id": `${url}#webpage` },
      ...(organizationId ? { publisher: { "@id": organizationId } } : {}),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Learn", item: absoluteUrl("/Learn") },
        ...breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          position: index + 3,
          name: item.name,
          item: absoluteUrl(item.item),
        })),
      ],
    },
  ];
  const jsonLd = { "@context": "https://schema.org", "@graph": graph };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}
