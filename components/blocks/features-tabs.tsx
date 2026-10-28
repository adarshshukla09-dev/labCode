"use client";

import { useEffect, useState } from "react";
import {
  ArrowRightIcon,
  CheckIcon,
  Code2Icon,
  DatabaseIcon,
  TerminalIcon,
} from "lucide-react";

import { BlurFade } from "@/components/velora/blur-fade";
import { cn } from "@/lib/utils";

const LABS = [
  {
    value: "sql",
    label: "SQL",
    subtitle: "Query fundamentals",
    icon: Code2Icon,
    title: "Master SQL by writing queries.",
    description:
      "Stop memorizing syntax from videos. Write real SQL queries, filter datasets, join tables, and solve practical challenges with instant feedback.",
    points: [
      "Practice SELECT, WHERE, and JOIN",
      "Solve interactive query challenges",
      "Build confidence with real datasets",
    ],
    command: "SELECT name, department",
    command2: "FROM employees",
    command3: "WHERE salary > 50000;",
    result: [
      ["Alex Morgan", "Engineering"],
      ["Sam Wilson", "Analytics"],
      ["Jamie Lee", "Marketing"],
    ],
    output: "3 rows returned in 12ms",
    color: "text-primary",
  },
  {
    value: "postgresql",
    label: "PostgreSQL",
    subtitle: "Relational databases",
    icon: DatabaseIcon,
    title: "Go deeper with PostgreSQL.",
    description:
      "Learn how real relational databases work. Practice joins, aggregations, constraints, indexing, and advanced queries in hands-on exercises.",
    points: [
      "Work with relational schemas",
      "Practice joins and aggregations",
      "Understand indexes and performance",
    ],
    command: "SELECT department,",
    command2: "       COUNT(*) AS total",
    command3: "FROM employees GROUP BY department;",
    result: [
      ["Engineering", "12"],
      ["Analytics", "8"],
      ["Marketing", "6"],
    ],
    output: "3 groups returned in 8ms",
    color: "text-primary",
  },
  {
    value: "mongodb",
    label: "MongoDB",
    subtitle: "Document databases",
    icon: TerminalIcon,
    title: "Think in documents with MongoDB.",
    description:
      "Move beyond relational thinking. Query documents, filter collections, update records, and explore aggregation pipelines through practical labs.",
    points: [
      "Query JSON-like documents",
      "Filter and update collections",
      "Practice aggregation pipelines",
    ],
    command: "db.users.find({",
    command2: '  role: "developer",',
    command3: "  active: true",
    result: [
      ["Alex Morgan", "developer"],
      ["Sam Wilson", "developer"],
      ["Jamie Lee", "developer"],
    ],
    output: "3 documents returned",
    color: "text-primary",
  },
] as const;

type Lab = (typeof LABS)[number];

const ANIMATIONS = [
  "lab-enter-top-left",
  "lab-enter-bottom-right",
  "lab-enter-top-right",
  "lab-enter-bottom-left",
];

export function FeaturesTabs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitionIndex, setTransitionIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const activeLab = LABS[activeIndex];

  function selectLab(index: number) {
    if (index === activeIndex) return;

    setActiveIndex(index);
    setTransitionIndex((previous) => previous + 1);
  }

  // Automatically cycle through the database labs.
  useEffect(() => {
    if (paused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % LABS.length);
      setTransitionIndex((previous) => previous + 1);
    }, 1500);

    return () => window.clearInterval(timer);
  }, [paused]);

  const animation =
    ANIMATIONS[(transitionIndex - 1 + ANIMATIONS.length) % ANIMATIONS.length];

  return (
    <section
      id="labs"
      className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8"
    >
      <style>{`
        @keyframes labTopLeft {
          from { opacity: 0; transform: translate(-36px, -32px) scale(.98); }
          to   { opacity: 1; transform: translate(0, 0) scale(1); }
        }

        @keyframes labBottomRight {
          from { opacity: 0; transform: translate(36px, 32px) scale(.98); }
          to   { opacity: 1; transform: translate(0, 0) scale(1); }
        }

        @keyframes labTopRight {
          from { opacity: 0; transform: translate(36px, -32px) scale(.98); }
          to   { opacity: 1; transform: translate(0, 0) scale(1); }
        }

        @keyframes labBottomLeft {
          from { opacity: 0; transform: translate(-36px, 32px) scale(.98); }
          to   { opacity: 1; transform: translate(0, 0) scale(1); }
        }

        .lab-enter-top-left {
          animation: labTopLeft .65s cubic-bezier(.22, 1, .36, 1) both;
        }

        .lab-enter-bottom-right {
          animation: labBottomRight .65s cubic-bezier(.22, 1, .36, 1) both;
        }

        .lab-enter-top-right {
          animation: labTopRight .65s cubic-bezier(.22, 1, .36, 1) both;
        }

        .lab-enter-bottom-left {
          animation: labBottomLeft .65s cubic-bezier(.22, 1, .36, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .lab-enter-top-left,
          .lab-enter-bottom-right,
          .lab-enter-top-right,
          .lab-enter-bottom-left {
            animation: none;
          }
        }
      `}</style>

      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-32 -z-10 size-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <BlurFade>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 font-mono text-xs text-primary">
              <span className="size-1.5 animate-pulse rounded-full bg-primary" />
              EXPLORE THE LABS
            </span>

            <h2 className="mt-6 text-3xl font-bold tracking-tight text-balance sm:text-5xl">
              Stop watching tutorials.
              <br />
              <span className="text-primary">Start writing queries.</span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Learn databases the hands-on way. Experiment with real queries,
              solve practical challenges, and build skills that stick — one
              interactive lab at a time.
            </p>
          </div>
        </BlurFade>

        {/* Database tabs */}
        <BlurFade delay={0.1}>
          <div
            className="mx-auto mt-12 flex max-w-fit flex-wrap items-center justify-center gap-2 rounded-2xl border border-border bg-card/80 p-2 shadow-sm backdrop-blur"
            role="tablist"
            aria-label="Choose a database lab"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setPaused(false);
              }
            }}
          >
            {LABS.map((lab, index) => {
              const Icon = lab.icon;
              const selected = activeIndex === index;

              return (
                <button
                  key={lab.value}
                  id={`lab-tab-${lab.value}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="lab-panel"
                  onClick={() => selectLab(index)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    selected
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/15"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {lab.label}
                </button>
              );
            })}
          </div>
        </BlurFade>

        {/* Animated lab panel */}
        <div
          className="relative mt-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            key={`${activeLab.value}-${transitionIndex}`}
            id="lab-panel"
            role="tabpanel"
            aria-labelledby={`lab-tab-${activeLab.value}`}
            className={cn(
              "overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-primary/[0.04]",
              animation,
            )}
          >
            <div className="grid lg:grid-cols-2">
              {/* Copy */}
              <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
                <span className="flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 font-mono text-xs text-primary">
                  <activeLab.icon className="size-3.5" />
                  {activeLab.subtitle}
                </span>

                <h3 className="mt-6 text-2xl font-bold tracking-tight text-balance sm:text-4xl">
                  {activeLab.title}
                </h3>

                <p className="mt-4 leading-7 text-muted-foreground">
                  {activeLab.description}
                </p>

                <ul className="mt-7 space-y-3">
                  {activeLab.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                        <CheckIcon className="size-3.5" />
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={`/labs/${activeLab.value}`}
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20"
                >
                  Explore {activeLab.label} labs
                  <ArrowRightIcon className="size-4" />
                </a>

                <div className="mt-8 flex items-center gap-2 font-mono text-xs text-muted-foreground">
                  <span className="size-2 rounded-full bg-primary" />
                  {String(activeIndex + 1).padStart(2, "0")} /{" "}
                  {String(LABS.length).padStart(2, "0")}
                  <span className="ml-2">Interactive learning</span>
                </div>
              </div>

              {/* Code preview */}
              <div className="flex items-center bg-muted/30 p-4 sm:p-8 lg:p-10">
                <div className="w-full overflow-hidden rounded-xl border border-border bg-background shadow-lg">
                  {/* Editor header */}
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full bg-red-400/80" />
                      <span className="size-2.5 rounded-full bg-yellow-400/80" />
                      <span className="size-2.5 rounded-full bg-primary" />
                    </div>

                    <span className="font-mono text-xs text-muted-foreground">
                      {activeLab.value}.lab
                    </span>

                    <span className="rounded-md bg-primary/10 px-2 py-1 font-mono text-[10px] text-primary">
                      PLAYGROUND
                    </span>
                  </div>

                  {/* Query */}
                  <div className="space-y-1 overflow-x-auto p-4 font-mono text-xs leading-6 sm:p-6 sm:text-sm">
                    <p className="text-muted-foreground/60">
                      -- Your next skill starts here
                    </p>
                    <p className="text-primary">{activeLab.command}</p>
                    <p className="text-primary">{activeLab.command2}</p>
                    <p className="text-primary">{activeLab.command3}</p>
                  </div>

                  {/* Output */}
                  <div className="border-t border-border">
                    <div className="flex items-center justify-between bg-muted/40 px-4 py-3">
                      <span className="font-mono text-xs font-medium">
                        OUTPUT
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-primary">
                        <CheckIcon className="size-3" />
                        SUCCESS
                      </span>
                    </div>

                    <div className="overflow-x-auto p-4">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-border text-muted-foreground">
                            <th className="pb-3 pr-3 font-medium">Result</th>
                            <th className="pb-3 font-medium">
                              {activeLab.value === "postgresql"
                                ? "Count"
                                : activeLab.value === "mongodb"
                                  ? "Role"
                                  : "Department"}
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {activeLab.result.map((row, index) => (
                            <tr
                              key={`${activeLab.value}-${row[0]}`}
                              className="border-b border-border/50 last:border-0"
                              style={{
                                animation: `labRowIn .3s ease-out ${index * 100}ms both`,
                              }}
                            >
                              <td className="py-3 pr-3 text-foreground">
                                {row[0]}
                              </td>
                              <td className="py-3 text-muted-foreground">
                                {row[1]}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <p className="mt-4 font-mono text-[10px] text-primary">
                        {activeLab.output}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Automatic rotation indicator */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {LABS.map((lab, index) => (
            <button
              key={lab.value}
              type="button"
              onClick={() => selectLab(index)}
              aria-label={`Show ${lab.label} lab`}
              aria-current={activeIndex === index ? "true" : undefined}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                activeIndex === index
                  ? "w-8 bg-primary"
                  : "w-2 bg-border hover:bg-primary/50",
              )}
            />
          ))}
          <span className="ml-2 font-mono text-[10px] text-muted-foreground">
            AUTO-ROTATING
          </span>
        </div>
      </div>
    </section>
  );
}
