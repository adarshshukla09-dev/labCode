import { ArrowRightIcon, BookOpenIcon, TerminalIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { BlurFade } from "@/components/velora/blur-fade";
import { RetroGrid } from "@/components/velora/retro-grid";
import { Terminal } from "@/components/velora/terminal";
import { Typewriter } from "@/components/velora/typewriter";
import Link from "next/link";

const ACCENTS = ["SQL exercises.", "MongoDB exercises."];

// Keep terminal lines short to avoid wrapping on mobile.
const SESSION = [
  "SELECT department, COUNT(*)",
  "FROM employees",
  "GROUP BY department;",
  "-- Practice queries in the SQL lab",
];

const LABS = ["SQL practice", "MongoDB practice"];

/**
- Labs landing page hero.
- Hands-on SQL and MongoDB learning with a terminal-inspired preview,
- animated headline, retro grid, and lime-green accents.
 */
export function HeroGridMinimal() {
  return (
    <section className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
      {/* Subtle retro grid using the existing lime-green theme */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-3/4"
      >
        <RetroGrid angle={65} cellSize={48} opacity={0.35} />
      </div>

      {/* Soft ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-20 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-[100px] sm:h-[28rem] sm:w-[28rem]"
      />

      <div className="mx-auto max-w-4xl text-center">
        <BlurFade>
          <a
            href="#lab-tracks"
            className="group inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-card/70 py-1.5 pr-4 pl-2 font-mono text-xs text-muted-foreground backdrop-blur-md transition-all hover:border-primary/50 hover:text-foreground hover:shadow-sm"
          >
            <span className="rounded-full bg-primary/20 px-2 py-0.5 font-semibold text-primary">
              Labs
            </span>
            <span>Learn databases by doing, not watching.</span>
            <ArrowRightIcon className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
        </BlurFade>

        <BlurFade delay={0.1} className="mx-auto">
          <h1 className="mt-8 text-4xl mx-auto font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Learn databases by practicing
            <div className="mt-2 mx-auto inline-block min-h-[1.2em] bg-gradient-to-r from-primary via-primary/90 to-foreground bg-clip-text text-transparent">
              <Typewriter
                words={ACCENTS}
                className="bg-gradient-to-r from-primary to-foreground bg-clip-text mx-auto text-transparent"
              />
            </div>
          </h1>
        </BlurFade>

        <BlurFade delay={0.2}>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
            Practice SQL and MongoDB with interactive database lessons. Write
            queries, work through practical challenges, and build database
            skills one concept at a time.
          </p>
        </BlurFade>

        {/* Primary and secondary actions */}
        <BlurFade delay={0.3}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/labs/sql"
              className={buttonVariants({
                size: "lg",
                className:
                  "h-12 w-full px-7 font-semibold shadow-lg shadow-primary/10 transition-all hover:shadow-primary/20 sm:w-auto",
              })}
            >
              Explore the labs
              <ArrowRightIcon className="ml-2 size-4" />
            </Link>

            <Link
              href="/labs"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "h-12 w-full px-7 backdrop-blur-sm transition-colors hover:bg-muted/50 sm:w-auto",
              })}
            >
              <BookOpenIcon className="mr-2 size-4" />
              How it works
            </Link>
          </div>
        </BlurFade>

        {/* Small trust/feature indicators */}
        <BlurFade delay={0.35}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-xs text-muted-foreground sm:text-sm">
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Learn by doing
            </span>

            <span aria-hidden="true" className="text-border">
              /
            </span>

            <span>Instant feedback</span>

            <span aria-hidden="true" className="text-border">
              /
            </span>

            <span>Real queries</span>
          </div>
        </BlurFade>
      </div>

      {/* Terminal preview */}
      <BlurFade
        delay={0.4}
        className="relative mx-auto mt-16 max-w-2xl sm:mt-20"
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-12 -inset-y-6 -z-10 rounded-full bg-primary/15 blur-[80px]"
        />

        <div className="overflow-hidden rounded-xl border border-border/80 bg-card/90 shadow-2xl shadow-primary/5 backdrop-blur-xl">
          {/* Terminal header */}
          <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-red-400/80" />
              <span className="size-2.5 rounded-full bg-yellow-400/80" />
              <span className="size-2.5 rounded-full bg-primary/80" />
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <TerminalIcon className="size-3.5 text-primary" />
              Labs / sql-practice
            </div>

            <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-medium text-primary">
              LIVE
            </span>
          </div>

          <div className="p-3 sm:p-5">
            <Terminal
              lines={SESSION}
              title="Labs SQL practice"
              className="min-h-[15.5rem] bg-transparent border-0 shadow-none"
            />
          </div>
        </div>

        {/* Current learning resources */}
        <div id="lab-tracks" className="mt-8 text-center">
          <p className="mb-3 font-mono text-xs tracking-wider text-muted-foreground">
            YOUR NEXT SKILL STARTS HERE
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {LABS.map((lab) => (
              <span
                key={lab}
                className="rounded-lg border border-border/80 bg-card/80 px-3.5 py-1.5 font-mono text-xs text-foreground backdrop-blur-md transition-all hover:border-primary/60 hover:text-primary hover:shadow-sm"
              >
                {lab}
              </span>
            ))}
          </div>
        </div>
      </BlurFade>
    </section>
  );
}
