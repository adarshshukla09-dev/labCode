"use client";

import { useState } from "react";
import SchemaViewer from "@/components/blocks/schemaViewer";
import type { LabSlug } from "@/lib/labs/lab-config";
import { usePathname } from "next/navigation";

type TabType = "question" | "schema";

interface CustomQuestionView {
  id: number;
  title: string;
  description: string;
  context: string;
  task: string;
  hint: string;
  difficulty: "Easy" | "Medium" | "Hard" | "";
}

interface QuestionSectionProps {
  lessonNumber: number | null;
  questionData:
    | {
        id: number;
        title: string;
        description: string | null;
        task: string;
        difficulty: string;
        hints: string[];
        context?: unknown;
      }
    | null
    | undefined;
  isPending: boolean;
  error: unknown;
  lab: LabSlug;
}

export default function QuestionSection({
  lessonNumber,
  questionData,
  isPending,
  error,
  lab,
}: QuestionSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>("question");
  const [showHint, setShowHint] = useState(false);
  const pathname = usePathname();
  if (lessonNumber === null) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Select a lesson to view its question.
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Loading question...
      </div>
    );
  }

  if (error || !questionData) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-destructive">
        Failed to load question.
      </div>
    );
  }

  const rawDifficulty = questionData.difficulty ?? "";
  const formattedDifficulty: "Easy" | "Medium" | "Hard" | "" = rawDifficulty
    ? ((rawDifficulty.charAt(0).toUpperCase() +
        rawDifficulty.slice(1).toLowerCase()) as "Easy" | "Medium" | "Hard")
    : "";

  const question: CustomQuestionView = {
    id: questionData.id,
    title: questionData.title,
    description: questionData.description ?? "",

    context: Array.isArray(questionData.context)
      ? questionData.context
          .map((entry) => {
            if (!entry || typeof entry !== "object") return String(entry);
            const context = entry as Record<string, unknown>;
            const name = lab === "sql" ? context.table : context.collection;
            const members = lab === "sql" ? context.columns : context.fields;
            return `${lab === "sql" ? "Table" : "Collection"}: ${String(name ?? "")} (${String(context.description ?? "")})\n${lab === "sql" ? "Columns" : "Fields"}: ${Array.isArray(members) ? members.join(", ") : ""}`;
          })
          .join("\n\n")
      : "",

    task: questionData.task,

    hint: Array.isArray(questionData.hints)
      ? (questionData.hints[0] ?? "")
      : "",

    difficulty: formattedDifficulty,
  };

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground">
      {/* Header */}
      <header className="flex shrink-0 flex-col border-b border-border bg-muted/20">
        <div className="flex items-center justify-between gap-4 px-5 py-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
              <svg
                className="h-5 w-5 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  d="M8 4h8l1 16H7L8 4Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M9 8h6M9 12h6M9 16h4" strokeLinecap="round" />
              </svg>
            </div>

            <div className="min-w-0">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Question {question.id}
              </span>

              <h2 className="truncate text-sm font-heading font-semibold text-foreground">
                {question.title}
              </h2>
            </div>
          </div>

          {question.difficulty && (
            <span
              className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                question.difficulty === "Easy"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : question.difficulty === "Medium"
                    ? "bg-yellow-500/10 text-yellow-400"
                    : "bg-destructive/10 text-destructive"
              }`}
            >
              {question.difficulty}
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-t border-border px-5">
          <button
            type="button"
            onClick={() => setActiveTab("question")}
            className={`border-b-2 py-2.5 text-xs font-medium transition ${
              activeTab === "question"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Problem Details
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("schema")}
            className={`border-b-2 py-2.5 text-xs font-medium transition ${
              activeTab === "schema"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Database Schema
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === "question" ? (
          <div className="h-full min-h-0 space-y-6 overflow-y-auto overscroll-contain p-5">
            <div>
              <h3 className="mb-3 font-heading text-sm font-semibold">
                Problem Description
              </h3>

              <p className="text-sm leading-7 text-muted-foreground">
                {question.description}
              </p>
            </div>

            {question.context && (
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
                  Context
                </h3>

                <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-foreground/90">
                  {question.context}
                </pre>
              </div>
            )}

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <h3 className="mb-3 font-heading text-sm font-semibold">
                Your Task
              </h3>

              <p className="text-sm leading-7 text-foreground/90">
                {question.task}
              </p>
            </div>

            {question.hint && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <button
                  type="button"
                  onClick={() => setShowHint((prev) => !prev)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                    {showHint ? "Hide Hint" : "Show Hint"}
                  </span>

                  <span className="text-sm text-amber-500">
                    {showHint ? "−" : "+"}
                  </span>
                </button>

                {showHint && (
                  <p className="mt-3 text-sm leading-6 text-foreground/90">
                    {question.hint}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="h-full min-h-0 overflow-y-auto overscroll-contain p-4">
            <SchemaViewer slug={lab} />
          </div>
        )}
      </div>
    </section>
  );
}
