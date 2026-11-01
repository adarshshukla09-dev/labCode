"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import type { QueryResult } from "@/components/labs/testCase";
import { toQueryResult } from "./execution-result";

export function useMongoExecution(questionId: number | undefined) {
  const trpc = useTRPC();

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);

  const mutation = useMutation(trpc.lab.mongodb.runQuery.mutationOptions());

  const statusQuery = useQuery({
    ...trpc.lab.mongodb.getQueryStatus.queryOptions({
      attemptId: attemptId ?? "00000000-0000-4000-8000-000000000000",
    }),
    enabled: !!attemptId,
    refetchInterval: (query) =>
      ["completed", "failed", "not_found"].includes(
        query.state.data?.status ?? "",
      )
        ? false
        : 1000,
  });

  const runQuery = async (query: string) => {
    if (!questionId) {
      throw new Error("Select a valid MongoDB question first.");
    }

    setQueryResult(null);
    setAttemptId(null);

    const response = await mutation.mutateAsync({
      questionId,
      query,
    });

    setAttemptId(response.attemptId);
  };

  const status = statusQuery.data;

  const terminal =
    !!attemptId &&
    !!status &&
    ["completed", "failed", "not_found"].includes(status.status);

  let settledResult: QueryResult | null = null;

  if (terminal && status) {
    switch (status.status) {
      case "completed":
        settledResult = toQueryResult(
          status.result,
          status.message,
          status.evaluation,
          true,
        );
        break;

      case "failed":
      case "not_found":
        settledResult = {
          columns: [],
          rows: [],
          error: status.message,
        };
        break;

      default:
        settledResult = null;
    }
  }

  return {
    runQuery,
    isRunning: mutation.isPending || (!!attemptId && !terminal),
    queryResult: queryResult ?? settledResult,
  };
}
