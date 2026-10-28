import {
  ArrowRightIcon,
  CheckIcon,
  Code2Icon,
  DatabaseIcon,
  GraduationCapIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/velora/blur-fade";
import { GlowingEffect } from "@/components/velora/glowing-effect";
import { GridPattern } from "@/components/velora/grid-pattern";
import { SpotlightCard } from "@/components/velora/spotlight-card";

const PLAN = {
  name: "xyzlabs Pro",
  price: 299,
  unit: "per month",
  note: "One simple plan. Learn by writing real queries.",
  included: [
    "Hands-on SQL practice labs",
    "PostgreSQL learning exercises",
    "MongoDB query challenges",
    "Interactive database practice",
    "Step-by-step learning challenges",
    "Practice real-world query patterns",
    "Ad-free learning experience",
    "Access to all included database labs",
  ],
};

const BENEFITS = [
  {
    icon: DatabaseIcon,
    title: "Three database tracks",
    description:
      "Practice SQL, PostgreSQL, and MongoDB with focused exercises designed to build practical database skills.",
  },
  {
    icon: Code2Icon,
    title: "Learn by doing",
    description:
      "Move beyond passive tutorials. Build confidence by writing queries and solving hands-on database challenges.",
  },
  {
    icon: GraduationCapIcon,
    title: "Beginner to advanced",
    description:
      "Strengthen your fundamentals and progress toward more complex queries and real-world database problems.",
  },
  {
    icon: ShieldCheckIcon,
    title: "No ads. Just learning.",
    description:
      "Enjoy a distraction-free learning experience that keeps your attention on the code and the problem at hand.",
  },
];

const REASSURANCES = [
  {
    question: "Which databases are included?",
    answer:
      "The plan covers the SQL, PostgreSQL, and MongoDB learning tracks included in xyzlabs.",
  },
  {
    question: "Do I need to install a database?",
    answer:
      "The labs are designed around hands-on practice. Check each lab's requirements for any setup needed.",
  },
  {
    question: "Is xyzlabs ad-free?",
    answer:
      "Yes. The learning experience is designed to keep ads out of your way so you can focus on practicing.",
  },
];

export function PricingSinglePlan() {
  return (
    <section
      id="pricing"
      className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:px-8"
    >
      <GridPattern
        aria-hidden
        className="absolute inset-0 -z-10 size-full stroke-foreground/[0.06] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_60%)]"
      />

      <div className="mx-auto max-w-7xl">
        <BlurFade className="max-w-2xl">
          <p className="text-sm font-medium text-primary">
            Simple pricing
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            Stop watching tutorials.
            <br />
            <span className="text-muted-foreground">
              Start mastering databases.
            </span>
          </h2>

          <p className="mt-5 text-lg text-pretty text-muted-foreground">
            One straightforward plan for learning SQL, PostgreSQL, and
            MongoDB through hands-on labs. Practice queries, solve challenges,
            and build database skills without distractions.
          </p>
        </BlurFade>

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Main pricing card */}
          <BlurFade delay={0.1} className="lg:col-span-6 xl:col-span-7">
            <div className="relative rounded-3xl">
              <SpotlightCard
                radius={420}
                className="rounded-3xl shadow-xl shadow-primary/5"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary/10 to-transparent"
                />

                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-brand-via to-transparent"
                />

                <div className="relative p-8 sm:p-10">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {PLAN.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Your database practice space
                      </p>
                    </div>

                    <Badge variant="secondary">Ad-free learning</Badge>
                  </div>

                  {/* Price */}
                  <div className="mt-8">
                    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-6xl font-semibold tracking-tight text-transparent tabular-nums">
                        ₹{PLAN.price}
                      </span>

                      <span className="text-muted-foreground">
                        {PLAN.unit}
                      </span>
                    </p>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {PLAN.note}
                    </p>
                  </div>

                  {/* CTA buttons */}
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <a
                      href="/labs"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Explore the labs
                      <ArrowRightIcon className="size-4" />
                    </a>

                    <a
                      href="/contact"
                      className="inline-flex h-11 items-center justify-center rounded-full border border-input bg-background px-6 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      Contact us
                    </a>
                  </div>

                  {/* Included features */}
                  <div className="mt-10 border-t pt-8">
                    <p className="text-sm font-medium">
                      Everything you need to practice
                    </p>

                    <ul className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                      {PLAN.included.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                            <CheckIcon
                              aria-hidden
                              className="size-3"
                            />
                          </span>

                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Database tracks */}
                  <div className="mt-10 grid grid-cols-3 gap-3 border-t pt-8">
                    {[
                      { name: "SQL", label: "Query fundamentals" },
                      { name: "PostgreSQL", label: "Relational database" },
                      { name: "MongoDB", label: "Document database" },
                    ].map((database) => (
                      <div
                        key={database.name}
                        className="rounded-xl border bg-muted/40 p-3 text-center"
                      >
                        <p className="text-sm font-semibold">
                          {database.name}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {database.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </SpotlightCard>

              <GlowingEffect proximity={96} spread={60} />
            </div>
          </BlurFade>

          {/* Benefits and FAQs */}
          <div className="lg:col-span-6 xl:col-span-5">
            <BlurFade delay={0.2}>
              <h3 className="text-lg font-semibold">
                Built for hands-on learning
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Less tutorial hopping. More practice, progress, and
                problem-solving.
              </p>

              <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {BENEFITS.map(({ icon: Icon, title, description }) => (
                  <li key={title}>
                    <span className="grid size-10 place-items-center rounded-xl border bg-card shadow-xs">
                      <Icon
                        aria-hidden
                        className="size-5 text-primary"
                      />
                    </span>

                    <p className="mt-4 font-medium">{title}</p>

                    <p className="mt-1 text-sm text-pretty text-muted-foreground">
                      {description}
                    </p>
                  </li>
                ))}
              </ul>
            </BlurFade>

            <BlurFade delay={0.3} className="mt-12 border-t pt-10">
              <h3 className="text-lg font-semibold">
                Frequently asked questions
              </h3>

              <dl className="mt-6 space-y-6">
                {REASSURANCES.map(({ question, answer }) => (
                  <div key={question}>
                    <dt className="font-medium">{question}</dt>

                    <dd className="mt-1 text-sm text-pretty text-muted-foreground">
                      {answer}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-8 text-sm text-muted-foreground">
                Have another question?{" "}
                <a
                  href="/contact"
                  className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                >
                  Get in touch
                </a>
              </p>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  );
}
