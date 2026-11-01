import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { labConfig, isLabSlug } from "@/lib/labs/lab-config";
import { pageMetadata } from "@/lib/seo";
import { PageJsonLd } from "@/components/seo/page-json-ld";
import LabWorkspace from "@/components/shared/LabWorkspace";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return Object.keys(labConfig).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isLabSlug(slug)) return { title: "Lab not found", robots: { index: false, follow: false } };
  const title = slug === "mongodb" ? "MongoDB Playground: Interactive Document Query Practice" : "SQL Playground: Interactive Query Practice";
  const description = slug === "mongodb"
    ? "Practice MongoDB document queries and aggregation in an interactive browser lab with guided lessons for students and beginner developers."
    : "Practice SQL queries in an interactive browser lab with guided lessons covering filtering, joins, and database fundamentals.";
  return pageMetadata(title, description, `/labs/${slug}`);
}

export default async function LabPage({ params }: Props) {
  const { slug } = await params;

  if (!isLabSlug(slug)) {
    notFound();
  }

  const config = labConfig[slug];

  const title = config.slug === "mongodb" ? "MongoDB Playground: Interactive Document Query Practice" : "SQL Playground: Interactive Query Practice";
  const description = config.slug === "mongodb"
    ? "Practice MongoDB document queries and aggregation in an interactive browser lab with guided lessons for students and beginner developers."
    : "Practice SQL queries in an interactive browser lab with guided lessons covering filtering, joins, and database fundamentals.";

  return <>
    <PageJsonLd title={title} description={description} path={`/labs/${slug}`} softwareApplication applicationName={`${config.title} by Labs`} />
    <LabWorkspace key={config.slug} config={config} />
  </>;
}
