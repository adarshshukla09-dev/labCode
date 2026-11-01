"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import type { LabSlug } from "@/lib/labs/lab-config";

export type LabLesson = { lessonNumber: number; title: string; chapter: string };
export type ActiveLabLesson = Pick<LabLesson, "lessonNumber" | "title" | "chapter">;

export function useLabContent(lab: LabSlug) {
  const trpc = useTRPC();
  const sidebarQuery = useQuery(trpc.lab.content.getSidebar.queryOptions({ lab }));
  const [activeLesson, setActiveLesson] = useState<ActiveLabLesson | null>(null);
  const selectedLesson = activeLesson ?? sidebarQuery.data?.[0] ?? null;
  const questionQuery = useQuery({
    ...trpc.lab.content.getQuestionByLesson.queryOptions({
      lab,
      chapter: selectedLesson?.chapter ?? "",
      lessonNumber: selectedLesson?.lessonNumber ?? 1,
    }),
    enabled: selectedLesson !== null,
    staleTime: 10 * 60 * 1000,
  });

  return { sidebar: sidebarQuery.data ?? [], sidebarLoading: sidebarQuery.isPending,
    selectedLesson, selectLesson: setActiveLesson, question: questionQuery.data,
    questionLoading: questionQuery.isPending, questionError: questionQuery.error };
}
