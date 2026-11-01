"use client";

import type { LabSlug } from "@/lib/labs/lab-config";
import ResizableWorkspace from "@/components/blocks/resizeWorkspace";
import { useSqlExecution } from "@/components/labs/hooks/useSqlExecution";
import { useMongoExecution } from "@/components/labs/hooks/useMongoExecution";

export default function LabExecutionWorkspace({
  lab,
  questionId,
  starterQuery,
}: {
  lab: LabSlug;
  questionId?: number;
  starterQuery: string;
}) {
  const sql = useSqlExecution(lab === "sql" ? questionId : undefined);
  const mongodb = useMongoExecution(lab === "mongodb" ? questionId : undefined);
  const execution = lab === "sql" ? sql : mongodb;
  return (
    <ResizableWorkspace
      lab={lab}
      questionId={questionId}
      initialQuery={starterQuery}
      onRunQuery={execution.runQuery}
      isRunning={execution.isRunning}
      queryResult={execution.queryResult}
    />
  );
}
