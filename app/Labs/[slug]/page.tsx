import { Suspense } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import SQLABPage from "@/components/labs/slugPage";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { PageJsonLd } from "@/components/seo/page-json-ld";

const title = "SQL Practice Online: Interactive Query Lessons";
const description = "Learn SQL by writing queries in an interactive practice lab. Work through database lessons and test SELECT, filtering, joins and other SQL concepts.";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== "sql") {
    return { title: "Not found", robots: { index: false, follow: false } };
  }
  return pageMetadata(title, description, "/Labs/sql");
}

export function generateStaticParams() {
  return [{ slug: "sql" }];
}

async function SQLABData() {
  const queryClient = getQueryClient();

  const [firstLesson, sidebarData] = await Promise.all([
    queryClient.fetchQuery(
      trpc.labRouter.getFirstSqlLesson.queryOptions()
    ),
    queryClient.fetchQuery(
      trpc.labRouter.getSidebar.queryOptions()
    ),
  ]);

  if (firstLesson) {
    await queryClient.fetchQuery(
      trpc.labRouter.getSqlQuestionByLesson.queryOptions({
        lessonNumber: firstLesson.lessonNumber,
      })
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SQLABPage
        initialLesson={firstLesson}
        initialSidebar={sidebarData}
      />
    </HydrationBoundary>
  );
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug !== "sql") notFound();

  return (
    <>
      <PageJsonLd title={title} description={description} path="/Labs/sql" softwareApplication />
      <Suspense fallback={<div>Loading SQL Lab...</div>}>
        <SQLABData />
      </Suspense>
    </>
  );
}
