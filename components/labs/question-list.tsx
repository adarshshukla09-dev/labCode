"use client";

import { useState } from "react";
import SchemaViewer from "@/components/blocks/schemaViewer";

export interface Question {
  id: number;
  title: string;
  description: string;
  context: string;
  task: string;
  hint?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
}

interface QuestionSectionProps {
  question: Question;
}

type TabType = "question" | "schema";

export default function QuestionSection({
  question,
}: QuestionSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>("question");

  return (
<section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground">
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
                <path
                  d="M9 8h6M9 12h6M9 16h4"
                  strokeLinecap="round"
                />
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

          <div className="flex shrink-0 items-center gap-3">
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
        </div>

        {/* Tab Switcher */}
        <div className="flex border-t border-border px-5 gap-6">
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

     {/* Tab Content Body */}
<div className="flex-1 min-h-0 overflow-hidden">

  {activeTab === "question" ? (
    <div className="h-full min-h-0 overflow-y-auto overscroll-contain p-5 space-y-6">

      {/* Description */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground font-heading">
          Problem Description
        </h3>

        <p className="text-sm leading-7 text-muted-foreground">
          {question.description}
        </p>
      </div>

      {/* Context */}
      {question.context && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Context
            </h3>
          </div>

          <p className="text-sm leading-6 text-foreground/90">
            {question.context}
          </p>
        </div>
      )}

      {/* Task */}
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground font-heading">
          Your Task
        </h3>

        <p className="text-sm leading-7 text-foreground/90">
          {question.task}
        </p>
      </div>

      {/* Hint */}
      {question.hint && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-500">
            Hint
          </h3>

          <p className="text-sm leading-6 text-foreground/90">
            {question.hint}
          </p>
        </div>
      )}

    </div>
  ) : (
    <div className="h-full min-h-0 overflow-y-auto overscroll-contain p-4">
      <SchemaViewer />
    </div>
  )}

</div>
    </section>
  );
}