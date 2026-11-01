import { db } from "@/db/drizzle";
import { mongoQuestions } from "@/db/drizzle/schema";
import { mongoQueue } from "@/queues/mongo/producer";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { z } from "zod";

export const mongodbRouter = createTRPCRouter({
  runQuery: publicProcedure
    .input(
      z.object({
        questionId: z.number().int().positive(),
        query: z.string().min(1).max(10000),
      }),
    )
    .mutation(async ({ input }) => {
      const [question] = await db
        .select({ id: mongoQuestions.id })
        .from(mongoQuestions)
        .where(andPublished(input.questionId))
        .limit(1);
      if (!question)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "MongoDB question not found",
        });
      const attemptId = randomUUID();
      await mongoQueue.add(
        "evaluate-mongo",
        {
          attemptId,
          questionId: input.questionId,
          query: input.query,
        },
        {
          jobId: attemptId,
          attempts: 2,
          backoff: { type: "exponential", delay: 2000 },
          removeOnComplete: { age: 3600 },
          removeOnFail: { age: 86400 },
        },
      );
      return {
        attemptId,
        status: "queued" as const,
        message: "Your MongoDB query has been submitted.",
      };
    }),
  getQueryStatus: publicProcedure
    .input(z.object({ attemptId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const job = await mongoQueue.getJob(input.attemptId);
      if (!job )
        return {
          status: "not_found" as const,
          message: "MongoDB job not found.",
        };
      const state = await job.getState();
      if (state === "completed") {
        const output = job.returnvalue as {
          message: string;
          result?: {
            columns: string[];
            rows: Record<string, unknown>[];
            rowCount: number;
            rowsAffected: number;
          };
          isCorrect: boolean;
          score: number;
          totalPoints: number;
          matchType: string;
        } | null;
        if (!output)
          return {
            status: "failed" as const,
            message: "Worker completed without returning a result.",
          };
        return {
          status: "completed" as const,
          message: output.message,
          result: output.result ? {
            columns: output.result.columns,
            rows: output.result.rows,
            rowCount: output.result.rowCount,
            rowsAffected: output.result.rowsAffected,
          } : null,
          evaluation: {
            isCorrect: output.isCorrect,
            score: output.score,
            totalPoints: output.totalPoints,
            matchType: output.matchType,
            message: output.message,
          },
        };
      }
      if (state === "failed")
        return {
          status: "failed" as const,
          message: job.failedReason || "MongoDB evaluation failed.",
        };
      return {
        status: state,
        message:
          state === "active"
            ? "Executing MongoDB query..."
            : "Your MongoDB query is waiting to be processed.",
      };
    }),
});

function andPublished(questionId: number) {
  return and(
    eq(mongoQuestions.id, questionId),
    eq(mongoQuestions.status, "published"),
  );
}
