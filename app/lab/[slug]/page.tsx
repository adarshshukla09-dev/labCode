import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { labConfig, isLabSlug } from "@/lib/labs/lab-config";
import { pageMetadata } from "@/lib/seo";
import { PageJsonLd } from "@/components/seo/page-json-ld";
import LabWorkspace from "@/components/shared/LabWorkspace";
import { createCaller } from "@/trpc/routers/_app";
import { createTRPCContext } from "@/trpc/init";

// Import your server-side tRPC caller

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

  if (!isLabSlug(slug)) {
    return {
      title: "Lab not found",
      robots: { index: false, follow: false },
    };
  }

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
    slug === "mongodb"
      ? "MongoDB Playground: Interactive Document Query Practice"
      : "SQL Playground: Interactive Query Practice";

  const description =
    slug === "mongodb"
      ? "Practice MongoDB document queries and aggregation in an interactive browser lab with guided lessons for students and beginner developers."
      : "Practice SQL queries in an interactive browser lab with guided lessons covering filtering, joins, and database fundamentals.";

  // Fetch initial content on the server
  const caller = createCaller(await createTRPCContext());
  const sidebar = await caller.lab.content.getSidebar({
    lab: slug,
  });

  const firstLesson = sidebar[0] ?? null;

  const initialQuestion = firstLesson
    ? await caller.lab.content.getQuestionByLesson({
        lab: slug,
        chapter: firstLesson.chapter,
        lessonNumber: firstLesson.lessonNumber,
      })
    : null;

  return (
    <>
      <PageJsonLd
        title={title}
        description={description}
        path={`/lab/${slug}`}
        softwareApplication
        applicationName={`${config.title} by Labs`}
      />
      <section className="sr-only" aria-label="Lab course information">
        <h1>{title}</h1>

        <p>{description}</p>

        {slug === "sql" ? (
          <>
            <h2>Interactive SQL Playground</h2>
            <p>
              Learn SQL online with an interactive SQL playground designed for
              students, beginners, and aspiring database developers. Practice
              writing SQL queries, explore relational databases, and improve
              your database skills through practical exercises.
            </p>

            <h2>Practice SQL Queries Online</h2>
            <p>
              Learn essential SQL concepts including SELECT statements, WHERE
              conditions, filtering, sorting, aggregate functions, GROUP BY,
              HAVING, JOIN operations, and database fundamentals. Write and
              execute SQL queries directly in your browser.
            </p>

            <h2>SQL Practice Lessons</h2>
          </>
        ) : (
          <>
            <h2>Interactive MongoDB Playground</h2>
            <p>
              Learn MongoDB online with an interactive MongoDB playground.
              Practice document queries, explore collections, and understand
              NoSQL database concepts through hands-on exercises.
            </p>

            <h2>Practice MongoDB Queries Online</h2>
            <p>
              Learn MongoDB find queries, filtering, comparison operators,
              logical operators, sorting, projections, and aggregation
              pipelines. Write and practice MongoDB queries directly in your
              browser.
            </p>

            <h2>MongoDB Practice Lessons</h2>
          </>
        )}

        <p>
          Follow structured lessons, solve practical database problems, and
          improve your SQL and MongoDB query-writing skills with an interactive
          browser-based learning environment.
        </p>

        <h2>Course Chapters and Lessons</h2>

        {sidebar.map((lesson) => (
          <div key={`${lesson.chapter}-${lesson.lessonNumber}`}>
            <h3>
              {lesson.chapter} - Lesson {lesson.lessonNumber}: {lesson.title}
            </h3>
          </div>
        ))}
      </section>
      <LabWorkspace
        config={config}
        initialSidebar={sidebar}
        initialLesson={firstLesson}
        initialQuestion={initialQuestion}
      />
    </>
  );
}
