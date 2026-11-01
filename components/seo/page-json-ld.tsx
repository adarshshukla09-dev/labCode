import { absoluteUrl } from "@/lib/seo";

interface PageJsonLdProps {
  title: string;
  description: string;
  path: string;
  softwareApplication?: boolean;
  applicationName?: string;
  collectionPage?: boolean;
  collectionItemUrls?: string[];
}

export function PageJsonLd({ title, description, path, softwareApplication = false, applicationName = "Labs", collectionPage = false, collectionItemUrls = [] }: PageJsonLdProps) {
  const url = absoluteUrl(path);
  const websiteId = absoluteUrl("/#website");
  const organizationId = absoluteUrl("/#organization");
  if (!url) return null;

  const page: Record<string, unknown> = {
    "@type": collectionPage ? "CollectionPage" : "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    isPartOf: websiteId ? { "@id": websiteId } : undefined,
    publisher: organizationId ? { "@id": organizationId } : undefined,
    ...(softwareApplication
      ? {
          mainEntity: {
            "@type": "SoftwareApplication",
            name: applicationName,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            browserRequirements: "Requires JavaScript enabled",
            description,
            url,
            publisher: organizationId ? { "@id": organizationId } : undefined,
          },
        }
      : {}),
    ...(collectionPage && collectionItemUrls.length > 0
      ? {
          mainEntity: {
            "@type": "ItemList",
            itemListElement: collectionItemUrls.map((itemUrl, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: absoluteUrl(itemUrl),
            })),
          },
        }
      : {}),
  };
  const jsonLd = { "@context": "https://schema.org", ...page };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}
