"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Sidebar from "@/components/labs/sidebar";
import QuestionSection from "@/components/labs/question-list";
import ResizableWorkspace from "@/components/blocks/resizeWorkspace";
import { type QueryResult } from "@/components/labs/testCase";
import { useTRPC } from "@/trpc/client";

interface ActiveLesson {
  lessonNumber: number;
  title: string;
}

interface SQLABPageProps {
  initialLesson: ActiveLesson | null;
  initialSidebar: {
    lessonNumber: number;
    title: string;
    chapters: string[];
  }[];
}

type QueryCell = string | number | boolean | null;
type QueryRow = Record<string, unknown>;

const normalizeCell = (value: unknown): QueryCell => {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null
  ) {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (value === undefined) {
    return null;
  }

  return JSON.stringify(value);
};

export default function SQLABPage({
  initialLesson,
  initialSidebar,
}: SQLABPageProps) {
  const trpc = useTRPC();
  const [activeLesson, setActiveLesson] = useState<ActiveLesson | null>(
    initialLesson,
  );
  const [isRunning, setIsRunning] = useState(false);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const {
    data: questionData,
    isPending,
    error,
  } = useQuery({
    ...trpc.labRouter.getSqlQuestionByLesson.queryOptions({
      lessonNumber: activeLesson?.lessonNumber ?? 0,
    }),
    enabled: activeLesson !== null,
    staleTime: 10 * 60 * 1000,
  });

  const { data: jobStatus } = useQuery({
    ...trpc.labRouter.getSqlQueryStatus.queryOptions({
      attemptId: attemptId ?? "",
    }),
    enabled: !!attemptId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;

      if (
        status === "completed" ||
        status === "failed" ||
        status === "not_found"
      ) {
        return false;
      }

      return 1000;
    },
  });

  const handleLessonSelect = useCallback((lesson: ActiveLesson) => {
    setActiveLesson(lesson);
    setQueryResult(null);
  }, []);

  const runSqlMutation = useMutation(
    trpc.labRouter.runSqlQuery.mutationOptions(),
  );

  const handleRunQuery = async (query: string) => {
    if (!questionData?.id) {
      setQueryResult({
        columns: [],
        rows: [],
        error: "Please select a valid question.",
      });
      return;
    }

    setIsRunning(true);
    setQueryResult(null);
    setAttemptId(null);

    try {
      const response = await runSqlMutation.mutateAsync({
        questionId: questionData.id,
        query,
      });

      console.log("SQL Job Submitted:", response);

      setAttemptId(response.attemptId);
    } catch (error) {
      console.error("SQL submission failed:", error);

      setQueryResult({
        columns: [],
        rows: [],
        error:
          error instanceof Error
            ? error.message
            : "Failed to submit SQL query.",
      });

      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (!jobStatus) return;

    if (jobStatus.status === "completed") {
      const result = jobStatus.result;

      if (!result) {
        setQueryResult({
          columns: [],
          rows: [],
          error: "Worker completed without returning SQL output.",
        });
      } else {
        const columns: string[] = result.columns;

        const rows: QueryCell[][] = result.rows.map(
          (row: QueryRow): QueryCell[] =>
            columns.map((column: string) => normalizeCell(row[column])),
        );

        setQueryResult({
          columns,
          rows,
          executionTime: 0,
          evaluation: jobStatus.evaluation,
        });
      }

      setIsRunning(false);
      setAttemptId(null);
    }

    if (jobStatus.status === "failed" || jobStatus.status === "not_found") {
      setQueryResult({
        columns: [],
        rows: [],
        error: jobStatus.message,
      });

      setIsRunning(false);
      setAttemptId(null);
    }
  }, [jobStatus]);

  return (
    <div className="flex h-screen w-full gap-3 overflow-hidden bg-background p-3 text-foreground">
      <Sidebar
        sidebarData={initialSidebar}
        activeLessonNumber={activeLesson?.lessonNumber ?? null}
        activeLessonTitle={activeLesson?.title ?? "Select a lesson"}
        onLessonSelect={handleLessonSelect}
      />

      <main className="grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-2">
        <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
          <QuestionSection
            questionData={questionData}
            isPending={isPending}
            error={error}
            lessonNumber={activeLesson?.lessonNumber ?? null}
          />
        </div>

        <div className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-background">
          <ResizableWorkspace
            initialQuery={""}
            onRunQuery={handleRunQuery}
            isRunning={isRunning}
            queryResult={queryResult}
          />
        </div>
      </main>
    </div>
  );
}
