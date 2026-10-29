"use client";

import {
  DatabaseIcon,
  TerminalIcon,
  Code2Icon,
  Table2Icon,
  LayersIcon,
  SearchIcon,
} from "lucide-react";

import { BlurFade } from "@/components/velora/blur-fade";
import { GlareCard } from "@/components/velora/glare-card";

const LABS = [
  {
    title: "SQL Fundamentals",
    subtitle: "Start querying data",
    description:
      "Learn the foundations of SQL by writing real queries and solving interactive challenges.",
    icon: TerminalIcon,
    level: "BEGINNER",
    topics: ["SELECT & WHERE", "Filtering & Sorting", "Aggregations"],
    href: "/Labs/sql",
  },
  {
    title: "PostgreSQL",
    subtitle: "Work with relational data",
    description:
      "Build practical PostgreSQL skills with joins, relationships, and advanced queries.",
    icon: DatabaseIcon,
    level: "INTERMEDIATE",
    topics: ["Joins & Relationships", "CTEs & Subqueries", "Window Functions"],
    href: "/Labs/postgresql",
  },
  {
    title: "MongoDB",
    subtitle: "Explore document databases",
    description:
      "Learn to query and manipulate flexible document-based data with MongoDB.",
    icon: LayersIcon,
    level: "BEGINNER",
    topics: ["Documents & Collections", "CRUD Operations", "Aggregation"],
    href: "/Labs/mongodb",
  },
  {
    title: "SQL Joins",
    subtitle: "Connect related tables",
    description:
      "Master INNER JOIN, LEFT JOIN, and other techniques for combining related data.",
    icon: Table2Icon,
    level: "INTERMEDIATE",
    topics: ["INNER JOIN", "LEFT & RIGHT JOIN", "Multi-table Queries"],
    href: "/Labs/sql-joins",
  },
  {
    title: "Query Challenges",
    subtitle: "Put your skills to the test",
    description:
      "Solve hands-on database problems, test your understanding, and improve your query-writing skills.",
    icon: Code2Icon,
    level: "PRACTICE",
    topics: ["Real-world Problems", "Query Optimization", "Skill Challenges"],
    href: "/Labs/challenges",
  },
  {
    title: "Data Exploration",
    subtitle: "Find insights in data",
    description:
      "Explore datasets, discover patterns, and answer meaningful questions using database queries.",
    icon: SearchIcon,
    level: "PRACTICE",
    topics: ["Data Filtering", "Grouping & Analysis", "Real-world Datasets"],
    href: "/Labs/exploration",
  },
];


export function LabsGrid() {
  return (
    <section
      id="labs"
      className="relative isolate overflow-hidden px-6 py-12 sm:px-8 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <BlurFade>
          <div className="mb-8 text-center sm:mb-10">
            <p className="font-mono text-xs tracking-[0.2em] text-primary sm:text-sm">
              YOUR LEARNING PATH
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Learn by{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-foreground bg-clip-text text-transparent">
                doing.
              </span>
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Pick a database, open a lab, and start solving real problems.
              No endless tutorials. Just hands-on practice.
            </p>
          </div>
        </BlurFade>

        {/* Three-column rectangular GlareCard grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LABS.map((lab, index) => {
            const Icon = lab.icon;

            return (
              <BlurFade key={lab.title} delay={0.05 * index}>
                <GlareCard className="flex h-full w-full max-w-none flex-col justify-between rounded-2xl border border-border/80 bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-xl shadow-black/10 transition-colors hover:border-primary/40">
                  <div className="space-y-4">
                    {/* Header with Icon and Level */}
                    <div className="flex items-center justify-between">
                      <div className="flex size-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>

                      <span className="rounded-md border border-border bg-muted/60 px-2 py-1 font-mono text-[10px] tracking-wider text-muted-foreground">
                        {lab.level}
                      </span>
                    </div>

                    {/* Title and Subtitle */}
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-foreground">
                        {lab.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {lab.subtitle}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {lab.description}
                    </p>

                    {/* Topics */}
                    <div>
                      <p className="mb-2 font-mono text-xs tracking-wider text-foreground">
                        WHAT YOU&apos;LL LEARN
                      </p>

                      <ul className="space-y-1.5">
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
                  <div className="mt-6 pt-2">
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