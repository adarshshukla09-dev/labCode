"use client";

import type { LabConfig } from "@/lib/labs/lab-config";
import Sidebar from "@/components/labs/sidebar";
import QuestionSection from "@/components/labs/question-list";
import LabExecutionWorkspace from "@/components/labs/LabExecutionWorkspace";
import { useLabContent } from "@/components/labs/hooks/useLabContent";

export default function LabWorkspace({ config }: { config: LabConfig }) {
  const content = useLabContent(config.slug);

  return (
    <div className="flex h-screen w-full gap-3 overflow-hidden bg-background p-3 text-foreground">
      <Sidebar
        sidebarData={content.sidebar}
        activeLessonNumber={content.selectedLesson?.lessonNumber ?? null}
        activeChapter={content.selectedLesson?.chapter ?? null}
        activeLessonTitle={content.selectedLesson?.title ?? "Select a lesson"}
        labTitle={config.title}
        onLessonSelect={content.selectLesson}
      />
      <main className="grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-2">
        <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
          <QuestionSection
            key={content.question?.id ?? "loading"}
            lab={config.slug}
            questionData={content.question}
            isPending={content.questionLoading}
            error={content.questionError}
            lessonNumber={content.selectedLesson?.lessonNumber ?? null}
          />
        </div>
        <div className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-background">
          <LabExecutionWorkspace
            key={`${config.slug}:${content.selectedLesson?.chapter ?? ""}:${content.selectedLesson?.lessonNumber ?? ""}`}
            lab={config.slug}
            questionId={content.question?.id}
            starterQuery={content.question?.starterQuery ?? ""}
          />
        </div>
      </main>
    </div>
  );
}
