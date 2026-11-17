"use client";

import type { LabConfig } from "@/lib/labs/lab-config";

import Sidebar from "@/components/labs/sidebar";
import QuestionSection from "@/components/labs/question-list";
import LabExecutionWorkspace from "@/components/labs/LabExecutionWorkspace";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

type Props = {
  config: LabConfig;
  initialSidebar: {
    lessonNumber: number;
    title: string;
    chapter: string;
  }[];
  initialLesson: {
    lessonNumber: number;
    title: string;
    chapter: string;
  } | null;
  initialQuestion: any;
};

export default function LabWorkspace({
  config,
  initialSidebar,
  initialLesson,
  initialQuestion,
}: Props) {
  const [selectedLesson, setSelectedLesson] = useState(initialLesson);
  const trpc = useTRPC();
  const questionQuery = useQuery({
    ...trpc.lab.content.getQuestionByLesson.queryOptions({
      lab: config.slug,
      chapter: selectedLesson?.chapter ?? "",
      lessonNumber: selectedLesson?.lessonNumber ?? 1,
    }),
    enabled: selectedLesson !== null,
    initialData:
      selectedLesson?.chapter === initialLesson?.chapter &&
      selectedLesson?.lessonNumber === initialLesson?.lessonNumber
        ? initialQuestion
        : undefined,
    staleTime: 10 * 60 * 1000,
  });
  const question = questionQuery.data;

  return (
    <div className="flex h-screen w-full gap-3 overflow-hidden bg-background p-3 text-foreground">
      <Sidebar
        sidebarData={initialSidebar}
        activeLessonNumber={selectedLesson?.lessonNumber ?? null}
        activeChapter={selectedLesson?.chapter ?? null}
        activeLessonTitle={selectedLesson?.title ?? "Select a lesson"}
        labTitle={config.title}
        onLessonSelect={setSelectedLesson}
      />

      <main className="grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-2">
        <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
          <QuestionSection
            key={question?.id ?? "loading"}
            lab={config.slug}
            questionData={question}
            isPending={questionQuery.isPending}
            error={questionQuery.error}
            lessonNumber={selectedLesson?.lessonNumber ?? null}
          />
        </div>

        <div className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-background">
          <LabExecutionWorkspace
            key={`${config.slug}:${selectedLesson?.chapter ?? ""}:${selectedLesson?.lessonNumber ?? ""}`}
            lab={config.slug}
            questionId={question?.id}
            starterQuery={question?.starterQuery ?? ""}
          />
        </div>
      </main>
    </div>
  );
}
