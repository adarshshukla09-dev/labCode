"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  CheckIcon,
  Code2Icon,
  DatabaseIcon,
  GraduationCapIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/velora/blur-fade";
import { GridPattern } from "@/components/velora/grid-pattern";

const JOURNEY = [
  {
    number: "01",
    title: "Choose your lab",
    subtitle: "Start with the right database.",
    description:
      "Pick a learning track that matches your goals. Explore SQL fundamentals, PostgreSQL, or MongoDB and start building your database knowledge.",
    icon: DatabaseIcon,
    tag: "Choose your path",
    points: [
      "Explore SQL fundamentals",
      "Learn PostgreSQL",
      "Discover MongoDB",
    ],
    preview: {
      label: "AVAILABLE LABS",
      items: ["SQL", "PostgreSQL", "MongoDB"],
    },
  },
  {
    number: "02",
    title: "Solve challenges",
    subtitle: "Turn knowledge into practice.",
    description:
      "Get hands-on with database concepts. Write queries, work through challenges, and learn how to approach real-world data problems.",
    icon: Code2Icon,
    tag: "Learn by doing",
    points: [
      "Write and understand queries",
      "Practice database concepts",
      "Solve coding challenges",
    ],
    preview: {
      label: "YOUR FIRST QUERY",
      items: [
        "SELECT name",
        "FROM developers",
        "WHERE learning = true;",
      ],
    },
  },
  {
    number: "03",
    title: "Build confidence",
    subtitle: "Get better with every query.",
    description:
      "Strengthen your fundamentals and take on more complex problems. Turn consistent practice into skills you can use in projects and interviews.",
    icon: GraduationCapIcon,
    tag: "Keep progressing",
    points: [
      "Improve problem-solving skills",
      "Understand real-world patterns",
      "Prepare for bigger challenges",
    ],
    preview: {
      label: "YOUR PROGRESS",
      items: [
        "Understand the basics",
        "Practice with confidence",
        "Take on harder problems",
      ],
    },
  },
];

export function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<"forward" | "backward">(
    "forward",
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let animationFrame = 0;
    let lastIndex = 0;

    const updateJourney = () => {
      cancelAnimationFrame(animationFrame);

      animationFrame = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const scrollableDistance = section.offsetHeight - window.innerHeight;

        if (scrollableDistance <= 0) return;

        const progress = Math.min(
          1,
          Math.max(0, -rect.top / scrollableDistance),
        );

        const nextIndex = Math.min(
          JOURNEY.length - 1,
          Math.floor(progress * JOURNEY.length),
        );

        if (nextIndex !== lastIndex) {
          setDirection(nextIndex > lastIndex ? "forward" : "backward");
          setPreviousIndex(lastIndex);
          setActiveIndex(nextIndex);
          lastIndex = nextIndex;

          window.setTimeout(() => {
            setPreviousIndex((current) =>
              current === lastIndex ? null : current,
            );
          }, 750);
        }
      });
    };

    updateJourney();

    window.addEventListener("scroll", updateJourney, { passive: true });
    window.addEventListener("resize", updateJourney);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateJourney);
      window.removeEventListener("resize", updateJourney);
    };
  }, []);

  const activeJourney = JOURNEY[activeIndex];
  const ActiveIcon = activeJourney.icon;

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative isolate min-h-[260vh] overflow-clip px-6 lg:px-8"
    >
      <GridPattern
        aria-hidden
        className="absolute inset-0 -z-10 size-full stroke-foreground/[0.06] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />

      <div className="sticky top-0 mx-auto flex min-h-screen max-w-7xl flex-col justify-center py-20">
        {/* Heading */}
        <BlurFade className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="rounded-full px-4 py-1">
            Your learning journey
          </Badge>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            Your journey with{" "}
            <span className="text-primary">xyzlabs.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg">
            Three simple steps to move from learning database concepts to
            solving problems with confidence.
          </p>
        </BlurFade>

        {/* Horizontal journey */}
        <div className="relative mx-auto mt-12 w-full max-w-5xl">
          {/* Step indicators and dotted connector */}
          <div className="relative mx-auto mb-10 flex max-w-3xl items-center justify-between px-3 sm:px-8">
            <div
              aria-hidden
              className="absolute left-[12%] right-[12%] top-5 border-t-2 border-dotted border-border"
            />

            <div
              aria-hidden
              className="absolute left-[12%] top-5 h-0.5 bg-primary transition-all duration-700 ease-out"
              style={{
                width: `${(activeIndex / (JOURNEY.length - 1)) * 76}%`,
              }}
            />

            {JOURNEY.map((journey, index) => {
              const Icon = journey.icon;
              const isActive = index === activeIndex;
              const isComplete = index < activeIndex;

              return (
                <div
                  key={journey.number}
                  className="relative z-10 flex flex-col items-center gap-3"
                >
                  <div
                    className={[
                      "grid size-10 place-items-center rounded-full border transition-all duration-500 sm:size-11",
                      isActive
                        ? "scale-110 border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : isComplete
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-muted-foreground",
                    ].join(" ")}
                  >
                    {isComplete ? (
                      <CheckIcon className="size-4" aria-hidden />
                    ) : (
                      <Icon className="size-4" aria-hidden />
                    )}
                  </div>

                  <span
                    className={[
                      "hidden text-xs font-medium transition-colors duration-300 sm:block",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {journey.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Animated card viewport */}
          <div
            className="relative min-h-[440px] overflow-hidden rounded-3xl sm:min-h-[390px]"
            aria-live="polite"
            aria-atomic="true"
          >
            {/* Previous card exits toward the right */}
            {previousIndex !== null && (
              <div
                key={`exit-${previousIndex}-${activeIndex}`}
                aria-hidden="true"
                className="journey-card-exit pointer-events-none absolute inset-0"
              >
                <JourneyCard journey={JOURNEY[previousIndex]} />
              </div>
            )}

            {/* Current card enters from the left */}
            <div
              key={activeIndex}
              className="journey-card-enter relative h-full"
            >
              <JourneyCard journey={activeJourney} />
            </div>
          </div>

          {/* Scroll hint */}
          <div className="mt-8 flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-xs font-medium tracking-wide">
              SCROLL TO EXPLORE
            </span>
            <ArrowDownIcon className="size-4 animate-bounce" />
          </div>
        </div>
      </div>

      <style>{`
        .journey-card-enter {
          animation: journeyEnterLeft 750ms cubic-bezier(0.22, 1, 0.36, 1) both;
          will-change: transform, opacity;
        }

        .journey-card-exit {
          animation: journeyExitRight 750ms cubic-bezier(0.22, 1, 0.36, 1) both;
          will-change: transform, opacity;
        }

        @keyframes journeyEnterLeft {
          from {
            opacity: 0;
            transform: translate3d(-64px, 0, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes journeyExitRight {
          from {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
          to {
            opacity: 0;
            transform: translate3d(64px, 0, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .journey-card-enter,
          .journey-card-exit {
            animation-duration: 1ms;
          }
        }
      `}</style>
    </section>
  );
}

function JourneyCard({
  journey,
}: {
  journey: (typeof JOURNEY)[number];
}) {
  const Icon = journey.icon;

  return (
    <div className="relative h-full overflow-hidden rounded-3xl border bg-card/80 shadow-sm backdrop-blur-sm">
      {/* Subtle accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/[0.07] to-transparent"
      />

      <div className="relative grid h-full gap-8 p-6 sm:p-9 md:grid-cols-2 md:items-center md:gap-12 lg:p-12">
        {/* Copy */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold tabular-nums text-primary">
              STEP {journey.number}
            </span>

            <span className="h-px w-8 bg-primary/40" />

            <Badge variant="outline" className="text-xs">
              {journey.tag}
            </Badge>
          </div>

          <h3 className="mt-5 text-2xl font-semibold tracking-tight text-balance sm:text-3xl lg:text-4xl">
            {journey.title}
          </h3>

          <p className="mt-3 text-base font-medium text-primary">
            {journey.subtitle}
          </p>

          <p className="mt-4 max-w-lg text-sm leading-7 text-pretty text-muted-foreground sm:text-base">
            {journey.description}
          </p>

          <ul className="mt-6 grid gap-3">
            {journey.points.map((point) => (
              <li key={point} className="flex items-center gap-3 text-sm">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <CheckIcon className="size-3" aria-hidden />
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Visual preview */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-red-400/70" />
                <span className="size-2 rounded-full bg-yellow-400/70" />
                <span className="size-2 rounded-full bg-green-400/70" />
              </div>

              <span className="text-[10px] font-medium tracking-widest text-muted-foreground">
                XYZLABS
              </span>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Icon className="size-4 text-primary" aria-hidden />
                {journey.preview.label}
              </div>

              <div className="mt-5 grid gap-3">
                {journey.preview.items.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3 transition-colors duration-300 hover:border-primary/40"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="min-w-0 break-words font-mono text-xs text-foreground sm:text-sm">
                      {item}
                    </span>

                    <CheckIcon
                      className="ml-auto size-4 shrink-0 text-primary"
                      aria-hidden
                    />
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t pt-4">
                <span className="text-xs text-muted-foreground">
                  Step {journey.number} of 03
                </span>

                <span className="flex items-center gap-1 text-xs font-medium text-primary">
                  Keep going
                  <ArrowRightIcon className="size-3.5" aria-hidden />
                </span>
              </div>
            </div>
          </div>

          {/* Decorative glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-3 -z-10 rounded-3xl bg-primary/[0.06] blur-2xl"
          />
        </div>
      </div>
    </div>
  );
}
