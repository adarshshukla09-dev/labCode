"use client";

import { Database } from "lucide-react";

import { BlurFade } from "@/components/velora/blur-fade";
import { GlareCard } from "@/components/velora/glare-card";

const LABS = [
  {
    title: "SQL",
    subtitle: "Start querying data",
    description:
      "Learn the foundations of SQL by writing real queries and solving interactive challenges.",
    icon: Database,
    topics: ["SELECT & WHERE", "Filtering & Sorting", "Aggregations"],
    href: "/lab/sql",
  },
  {
    title: "MongoDB",
    subtitle: "Start querying documents",
    description:
      "Learn NoSQL fundamentals by writing aggregation pipelines and document queries.",
    icon: Database,
    topics: ["Find & Projection", "Query Operators", "Aggregation Framework"],
    href: "/lab/mongodb",
  },
];

export function LabsGrid() {
  return (
    <section
      id="available-labs"
      className="relative isolate overflow-hidden px-6 py-12 sm:px-8 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <BlurFade>
          <div className="mb-8 text-center sm:mb-10">
            <p className="font-mono text-xs tracking-[0.2em] text-primary sm:text-sm">
              YOUR LEARNING PATH
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Learn by{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-foreground bg-clip-text text-transparent">
                doing.
              </span>
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Open the interactive SQL and MongoDB labs to practice queries,
              document operations, and database fundamentals.
            </p>
          </div>
        </BlurFade>

        {/* Available learning labs grid */}
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
          {LABS.map((lab, index) => {
            const Icon = lab.icon;

            return (
              <BlurFade key={lab.title} delay={0.05 * index}>
                <GlareCard className="flex aspect-square w-full flex-col justify-between rounded-2xl border border-border/85 bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-xl shadow-black/10 transition-colors hover:border-primary/40">
                  <div className="space-y-3">
                    {/* Header with Icon */}
                    <div className="flex items-center justify-between">
                      <div className="flex size-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                    </div>

                    {/* Title and Subtitle */}
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-foreground">
                        {lab.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {lab.subtitle}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {lab.description}
                    </p>

                    {/* Topics */}
                    <div>
                      <p className="mb-1.5 font-mono text-[10px] sm:text-xs tracking-wider text-foreground">
                        WHAT YOU&apos;LL LEARN
                      </p>

                      <ul className="space-y-1">
                        {lab.topics.map((topic) => (
                          <li
                            key={topic}
                            className="flex items-center gap-2 text-xs text-foreground/80"
                          >
                            <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="pt-2">
                    <a
                      href={lab.href}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Start learning
                      <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </GlareCard>
              </BlurFade>
            );
          })}
        </div>
      </div>
    </section>
  );
}
