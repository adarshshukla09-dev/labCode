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
  if (!isLabSlug(slug))
    return { title: "Lab not found", robots: { index: false, follow: false } };
  const title =
    slug === "mongodb"
      ? "MongoDB Playground: Interactive Document Query Practice"
      : "SQL Playground: Interactive Query Practice";
  const description =
    slug === "mongodb"
      ? "Practice MongoDB document queries and aggregation in an interactive browser lab with guided lessons for students and beginner developers."
      : "Practice SQL queries in an interactive browser lab with guided lessons covering filtering, joins, and database fundamentals.";
  return pageMetadata(title, description, `/lab/${slug}`);
}

export default async function LabPage({ params }: Props) {
  const { slug } = await params;

  if (!isLabSlug(slug)) {
    notFound();
  }

  const config = labConfig[slug];

  const title =
    config.slug === "mongodb"
      ? "MongoDB Playground: Interactive Document Query Practice"
      : "SQL Playground: Interactive Query Practice";
  const description =
    config.slug === "mongodb"
      ? "Practice MongoDB document queries and aggregation in an interactive browser lab with guided lessons for students and beginner developers."
      : "Practice SQL queries in an interactive browser lab with guided lessons covering filtering, joins, and database fundamentals.";

  return (
    <>
      <PageJsonLd
        title={title}
        description={description}
        path={`/lab/${slug}`}
        softwareApplication
        applicationName={`${config.title} by Labs`}
      />
      <main className="mx-auto max-w-4xl space-y-4 px-6 py-10">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="max-w-3xl text-lg text-muted-foreground">{description}</p>
        {slug === "sql" ? (
          <section aria-labelledby="sql-lab-overview" className="space-y-3">
            <h2 id="sql-lab-overview" className="text-xl font-semibold">What you can practice</h2>
            <p>Work through guided SQL lessons using SELECT queries, filtering with WHERE, sorting, joins, and aggregation. Each lesson includes a problem prompt and an interactive editor where you can write and run a query.</p>
            <p>Start with a small query such as <code>SELECT name FROM students;</code>, then build toward combining tables and summarizing results.</p>
          </section>
        ) : (
          <section aria-labelledby="mongodb-lab-overview" className="space-y-3">
            <h2 id="mongodb-lab-overview" className="text-xl font-semibold">What you can practice</h2>
            <p>Work through guided MongoDB lessons using document filters, projections, updates, and aggregation pipelines. Each lesson includes a problem prompt and an interactive editor where you can write and run a query.</p>
            <p>Start with a document filter such as <code>{'{ "status": "active" }'}</code>, then build toward multi-stage aggregation pipelines.</p>
          </section>
        )}
      </main>
      <LabWorkspace key={config.slug} config={config} />
    </>
  );
}
