
import { ArrowRightIcon, BookOpenIcon, TerminalIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { BlurFade } from "@/components/velora/blur-fade";
import { RetroGrid } from "@/components/velora/retro-grid";
import { Terminal } from "@/components/velora/terminal";
import { Typewriter } from "@/components/velora/typewriter";
import Link from "next/link";

const ACCENTS = [
  "SQL.",
  "PostgreSQL.",
  "MongoDB.",
];

// Keep terminal lines short to avoid wrapping on mobile.
const SESSION = [
  "$ psql -d xyzlabs",
  "xyzlabs=# SELECT name, level",
  "xyzlabs-# FROM students;",
  " name   | level",
  "--------+--------",
  " Alex   | beginner",
  " Sam    | intermediate",
  "(2 rows)",
];

const LABS = ["SQL", "PostgreSQL", "MongoDB"];

/**
 * xyzlabs landing page hero.
 * Hands-on database learning with a terminal-inspired preview,
 * animated headline, retro grid, and lime-green accents.
 */
export function HeroGridMinimal() {
  return (
    <section className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
      {/* Subtle retro grid using the existing lime-green theme */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-3/4"
      >
        <RetroGrid angle={65} cellSize={48} opacity={0.45} />
      </div>

      {/* Soft ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl sm:h-96 sm:w-96"
      />

      <div className="mx-auto max-w-4xl text-center">
        <BlurFade>
          <a
            href="#labs"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card/80 py-1.5 pr-3 pl-1.5 font-mono text-xs text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
          >
            <span className="rounded-sm bg-primary px-2 py-1 font-semibold text-primary-foreground">
              xyzlabs
            </span>

            Learn databases by doing, not watching.

            <ArrowRightIcon className="size-3.5" />
          </a>
        </BlurFade>

        <BlurFade delay={0.1}>
          <h1 className="mt-8 text-4xl text-align-left font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Escape tutorial hell
            hands-on learning on
            


            <span className="mt-2 ml-3 inline-block min-h-[1.2em] bg-gradient-to-r from-primary via-primary to-foreground bg-clip-text text-transparent">
              <Typewriter
                words={ACCENTS}
                className="bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent"
              />
            </span>
          </h1>
        </BlurFade>

        <BlurFade delay={0.2}>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Stop passively watching tutorials. Write queries, solve
            interactive challenges, and build real database skills with
            hands-on SQL, PostgreSQL, and MongoDB labs.
          </p>
        </BlurFade>

        {/* Primary and secondary actions */}
        <BlurFade delay={0.3}>
<div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
  <Link
    href="#labs"
    className={buttonVariants({
      size: "lg",
      className: "h-12 w-full px-7 font-semibold sm:w-auto",
    })}
  >
    Explore the labs
    <ArrowRightIcon className="ml-1 size-4" />
  </Link>

  <Link
    href="#how-it-works"
    className={buttonVariants({
      variant: "outline",
      size: "lg",
      className: "h-12 w-full px-7 sm:w-auto",
    })}
  >
    <BookOpenIcon className="mr-1 size-4" />
    How it works
  </Link>
</div>

        </BlurFade>

        {/* Small trust/feature indicators */}
        <BlurFade delay={0.35}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-xs text-muted-foreground sm:text-sm">
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary" />
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
          className="absolute inset-x-12 -inset-y-6 -z-10 rounded-full bg-primary/15 blur-3xl"
        />

        <div className="overflow-hidden rounded-xl border border-border/80 bg-card/90 shadow-2xl shadow-primary/5 backdrop-blur">
          {/* Terminal header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-red-400/80" />
              <span className="size-2.5 rounded-full bg-yellow-400/80" />
              <span className="size-2.5 rounded-full bg-primary" />
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <TerminalIcon className="size-3.5" />
              xyzlabs / sql-playground
            </div>

            <span className="font-mono text-xs text-primary">
              LIVE
            </span>
          </div>

          <div className="p-2 sm:p-4">
            <Terminal
              lines={SESSION}
              title="xyzlabs@playground"
              className="min-h-[15.5rem]"
            />
          </div>
        </div>

        {/* Supported database labs */}
        <div id="labs" className="mt-6 text-center">
          <p className="mb-3 font-mono text-xs text-muted-foreground">
            YOUR NEXT SKILL STARTS HERE
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {LABS.map((lab) => (
              <span
                key={lab}
                className="rounded-md border border-border bg-card/80 px-3 py-1.5 font-mono text-xs text-foreground backdrop-blur transition-colors hover:border-primary/60 hover:text-primary"
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
