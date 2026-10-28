import {
  BracesIcon,
  Code2Icon,
  DatabaseIcon,
  Layers3Icon,
  TerminalIcon,
  WorkflowIcon,
} from "lucide-react";

import { Marquee } from "@/components/velora/marquee";
import { cn } from "@/lib/utils";

const LABS = [
  {
    name: "SQL",
    subtitle: "Query fundamentals",
    icon: DatabaseIcon,
  },
  {
    name: "PostgreSQL",
    subtitle: "Relational databases",
    icon: Layers3Icon,
  },
  {
    name: "MongoDB",
    subtitle: "Document databases",
    icon: BracesIcon,
  },
  {
    name: "Query Practice",
    subtitle: "Learn by doing",
    icon: TerminalIcon,
  },
  {
    name: "Database Concepts",
    subtitle: "Build your foundation",
    icon: WorkflowIcon,
  },
  {
    name: "Code & Learn",
    subtitle: "Practice real queries",
    icon: Code2Icon,
  },
];

/**
 * Animated learning-track marquee for xyzlabs.
 * Highlights database technologies and hands-on learning
 * instead of displaying fictional customer logos.
 */
export function LogosMarquee() {
  return (
    <section className="px-6 py-20 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">
            Your database learning space
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            Everything starts with a query.
          </h2>

          <p className="mt-3 text-sm text-pretty text-muted-foreground sm:text-base">
            Explore database technologies, practice your skills, and
            build confidence one query at a time.
          </p>
        </div>

        {/* Animated marquee */}
        <div className="relative mt-10">
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
          />

          <Marquee
            pauseOnHover
            repeat={3}
            role="list"
            aria-label="Database learning tracks and topics"
            className="py-8 [--duration:35s] [--gap:2.5rem] sm:[--gap:4rem]"
          >
            {LABS.map(({ name, subtitle, icon: Icon }) => (
              <div
                key={name}
                role="listitem"
                className="group flex shrink-0 items-center gap-3 text-muted-foreground transition-colors duration-300 hover:text-foreground motion-reduce:transition-none"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl border bg-card transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/5">
                  <Icon
                    aria-hidden
                    className="size-5 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary"
                  />
                </span>

                <div className="flex flex-col">
                  <span className="whitespace-nowrap text-sm font-semibold tracking-tight text-foreground">
                    {name}
                  </span>

                  <span className="mt-0.5 whitespace-nowrap text-xs text-muted-foreground">
                    {subtitle}
                  </span>
                </div>
              </div>
            ))}
          </Marquee>

          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
          />
        </div>
      </div>
    </section>
  );
}
