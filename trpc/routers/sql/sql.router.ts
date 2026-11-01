import { db } from "@/db/drizzle";
import { questions } from "@/db/drizzle/schema";
import { sqlQueue } from "@/queues/producer";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { z } from "zod";

export const sqlRouter = createTRPCRouter({
  runQuery: publicProcedure
    .input(
      z.object({
        questionId: z.number().int().positive(),
        query: z.string().min(1).max(10000),
      }),
    )
    .mutation(async ({ input }) => {
      const [question] = await db
        .select({ id: questions.id })
        .from(questions)
        .where(
          and(
            eq(questions.id, input.questionId),
            eq(questions.dialect, "sqlite"),
            eq(questions.status, "published"),
          ),
        )
        .limit(1);
      if (!question)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "SQL question not found",
        });
      const attemptId = randomUUID();
      await sqlQueue.add(
        "evaluate-sql",
        { attemptId, questionId: input.questionId, query: input.query },
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
        message: "Your SQL query has been submitted.",
      };
    }),
  getQueryStatus: publicProcedure
    .input(z.object({ attemptId: z.string().uuid() }))
    .query(async ({ input }) => {
      const job = await sqlQueue.getJob(input.attemptId);
      if (!job)
        return { status: "not_found" as const, message: "SQL job not found." };
      const state = await job.getState();
      if (state === "completed") {
        const output = job.returnvalue;
        if (!output)
          return {
            status: "failed" as const,
            message: "Worker completed without returning a result.",
          };
        return {
          status: "completed" as const,
          message: output.message,
          result: output.result
            ? {
                columns: output.result.columns,
                rows: output.result.rows,
                rowCount: output.result.rowCount,
                rowsAffected: output.result.rowsAffected,
              }
            : null,
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
          message: job.failedReason || "SQL evaluation failed.",
        };
      return {
        status: state,
        message:
          state === "active"
            ? "Executing SQL query..."
            : "Your SQL query is waiting to be processed.",
      };
    }),
});
