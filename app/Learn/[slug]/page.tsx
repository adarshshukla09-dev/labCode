import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { LearnBreadcrumbs } from "@/components/learn/breadcrumbs";
import { LearnArticleJsonLd } from "@/components/learn/learn-article-json-ld";
import { pageMetadata } from "@/lib/seo";
import { getLearnArticle, learnArticles } from "@/lib/learn-articles";
import { learnContent } from "@/lib/learn-content";

export function generateStaticParams() {
  return learnArticles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getLearnArticle(slug);
  if (!article) return { title: "Page not found", robots: { index: false, follow: false } };
  return pageMetadata(article.title, article.description, `/Learn/${slug}`, "article");
}

export default async function LearnArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getLearnArticle(slug);
  const content = learnContent[slug];
  if (!article || !content) notFound();

  const currentIndex = learnArticles.findIndex((item) => item.slug === slug);
  const previous = currentIndex > 0 ? learnArticles[currentIndex - 1] : undefined;
  const next = currentIndex < learnArticles.length - 1 ? learnArticles[currentIndex + 1] : undefined;
  const related = article.related.map((relatedSlug) => getLearnArticle(relatedSlug)).filter((item) => item !== undefined);
  const breadcrumb = [{ name: article.title, item: `/Learn/${slug}` }];
  const practiceHref = article.category === "MongoDB Guides" || slug.startsWith("mongodb-") ? "/labs/mongodb" : "/labs/sql";
  const practiceLabel = practiceHref === "/labs/mongodb" ? "MongoDB lab" : "SQL practice lab";

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <LearnArticleJsonLd title={article.title} description={article.description} path={`/Learn/${slug}`} breadcrumbs={breadcrumb} />
        <LearnBreadcrumbs items={breadcrumb} />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-14">
          <article className="min-w-0">
            <header className="mb-10 border-b border-border pb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{article.category}</p>
              <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">{article.title}</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">{article.summary}</p>
            </header>

            <div className="prose-learn max-w-3xl">
              {content.sections.map((section) => (
                <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`} className="mb-10 scroll-mt-24">
                  <h2 id={`${section.id}-heading`} className="mb-4 text-2xl font-semibold tracking-tight">{section.title}</h2>
                  <div className="space-y-4 text-[15px] leading-7 text-foreground/90">{section.content}</div>
                </section>
              ))}

              <section aria-labelledby="key-takeaways-heading" className="mb-10 rounded-2xl border border-border bg-muted/30 p-5 sm:p-6">
                <h2 id="key-takeaways-heading" className="text-lg font-semibold">Key takeaways</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
                  {content.takeaways.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>

              <section className="mb-10 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
                <h2 className="text-lg font-semibold">Practice what you learned</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Continue with guided lessons and hands-on practice in the interactive {practiceLabel}.</p>
                <Link href={practiceHref} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Open {practiceLabel} <ExternalLink aria-hidden="true" className="size-4" /></Link>
              </section>
            </div>

            <nav aria-label="Previous and next guides" className="grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
              {previous ? <Link href={`/Learn/${previous.slug}`} className="rounded-xl border border-border p-4 hover:border-primary/40"><span className="flex items-center gap-2 text-xs text-muted-foreground"><ArrowLeft aria-hidden="true" className="size-4" /> Previous guide</span><span className="mt-2 block font-medium">{previous.title}</span></Link> : <span />}
              {next ? <Link href={`/Learn/${next.slug}`} className="rounded-xl border border-border p-4 text-left hover:border-primary/40 sm:text-right"><span className="flex items-center justify-start gap-2 text-xs text-muted-foreground sm:justify-end">Next guide <ArrowRight aria-hidden="true" className="size-4" /></span><span className="mt-2 block font-medium">{next.title}</span></Link> : <span />}
            </nav>
          </article>

          <aside className="order-first lg:order-last">
            <div className="rounded-xl border border-border bg-card p-4 lg:sticky lg:top-24">
              <h2 className="text-sm font-semibold">On this page</h2>
              <nav aria-label="On this page" className="mt-3">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {content.sections.map((section) => <li key={section.id}><a href={`#${section.id}`} className="block leading-5 hover:text-foreground">{section.title}</a></li>)}
                  <li><a href="#key-takeaways-heading" className="block leading-5 hover:text-foreground">Key takeaways</a></li>
                </ul>
              </nav>
              <Link href="/Learn" className="mt-5 inline-flex items-center gap-2 border-t border-border pt-4 text-sm font-medium text-primary hover:underline"><ArrowLeft aria-hidden="true" className="size-4" /> All learning guides</Link>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related-guides-heading" className="mt-14 border-t border-border pt-8">
            <h2 id="related-guides-heading" className="text-2xl font-semibold tracking-tight">Related guides</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => <Link key={item.slug} href={`/Learn/${item.slug}`} className="rounded-xl border border-border bg-card p-5 hover:border-primary/40"><span className="text-xs font-medium uppercase tracking-wide text-primary">{item.category}</span><span className="mt-2 block font-semibold">{item.title}</span><span className="mt-2 block text-sm leading-6 text-muted-foreground">{item.summary}</span></Link>)}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
