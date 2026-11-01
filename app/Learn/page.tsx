import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpenText, Database, GraduationCap, PencilRuler, Braces } from "lucide-react";
import { PageJsonLd } from "@/components/seo/page-json-ld";
import { pageMetadata } from "@/lib/seo";
import { learnArticles, type LearnCategory } from "@/lib/learn-articles";

const title = "Learn SQL, MongoDB, and Database Concepts";
const description = "Explore beginner-friendly SQL and MongoDB tutorials, database fundamentals, balanced comparisons, and hands-on practice for students and developers.";
const categories: { id: string; name: LearnCategory; intro: string; icon: typeof BookOpenText }[] = [
  { id: "sql-notes", name: "SQL Notes", intro: "Build a foundation in SQL syntax and relational design.", icon: BookOpenText },
  { id: "database-guides", name: "Database Guides", intro: "Understand database concepts and make informed choices.", icon: Database },
  { id: "mongodb-guides", name: "MongoDB Guides", intro: "Learn documents, CRUD queries, data modeling, and aggregation pipelines.", icon: Braces },
  { id: "comparisons", name: "Comparisons", intro: "Compare database languages, models, and products fairly.", icon: PencilRuler },
  { id: "practice", name: "Practice", intro: "Try beginner queries and check your reasoning.", icon: GraduationCap },
];

export const metadata: Metadata = pageMetadata(title, description, "/Learn");

export default function LearnPage() {
  return (
    <main className="min-h-screen px-5 py-12 sm:px-8 sm:py-16">
      <PageJsonLd title={title} description={description} path="/Learn" collectionPage collectionItemUrls={learnArticles.map(({ slug }) => `/Learn/${slug}`)} />
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto mb-12 max-w-3xl text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">Learn with Labs</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Learn SQL, MongoDB, and database fundamentals</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Beginner-friendly notes, comparisons, and exercises for learning SQL, MongoDB, DBMS concepts, and relational and document databases.
            These foundations can support students in BCA, MCA, B.Tech, B.Sc IT, and other computer science courses; follow your institution’s syllabus for course-specific requirements.
          </p>
          <Link href="/labs/sql" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
            Explore SQL and MongoDB Labs <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </header>

        <nav aria-label="Learn topics" className="mb-12 flex flex-wrap justify-center gap-2">
          {categories.map(({ id, name }) => (
            <a key={name} href={`#${id}`} className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground">
              {name}
            </a>
          ))}
        </nav>

        <div className="mb-12 flex flex-wrap justify-center gap-3">
          <Link href="/labs/sql" className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:border-primary/50">Open SQL lab</Link>
          <Link href="/labs/mongodb" className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:border-primary/50">Open MongoDB lab</Link>
        </div>

        <div className="space-y-14">
          {categories.map(({ id, name, intro, icon: Icon }) => {
            const articles = learnArticles.filter((article) => article.category === name);
            return (
              <section key={name} id={id} aria-labelledby={`${id}-heading`}>
                <div className="mb-5 flex items-start gap-3">
                  <span className="mt-1 grid size-10 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary"><Icon aria-hidden="true" className="size-5" /></span>
                  <div>
                    <h2 id={`${id}-heading`} className="text-2xl font-semibold tracking-tight">{name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{intro}</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {articles.map((article) => (
                    <Link key={article.slug} href={`/Learn/${article.slug}`} className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <span className="text-xs font-medium uppercase tracking-wide text-primary">{article.category}</span>
                      <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight group-hover:text-primary">{article.title}</h3>
                      <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{article.summary}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium">Read guide <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" /></span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <aside className="mt-16 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
          <h2 className="text-xl font-semibold">Ready for hands-on practice?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Switch from reading to writing SQL queries or MongoDB document operations in the interactive Labs.</p>
          <div className="mt-5 flex flex-wrap gap-5">
            <Link href="/labs/sql" className="inline-flex items-center gap-2 font-medium text-primary hover:underline">Open SQL lab <ArrowRight aria-hidden="true" className="size-4" /></Link>
            <Link href="/labs/mongodb" className="inline-flex items-center gap-2 font-medium text-primary hover:underline">Open MongoDB lab <ArrowRight aria-hidden="true" className="size-4" /></Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
