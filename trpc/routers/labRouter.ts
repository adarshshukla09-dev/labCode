import { db } from "@/db/drizzle";
import { questions } from "@/db/drizzle/schema";
import { evaluateSql } from "@/ingestion/evaluate";
import { sqlQueue } from "@/queues/producer";
import { createTRPCRouter, publicProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";

import { and, asc, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

export const labRouter = createTRPCRouter({
  getSqlChapters: publicProcedure.query(async () => {
    return db
      .select({
        chapter: questions.chapter,
        sortOrder: sql<number>`MAX(${questions.lessonNumber})`,
      })
      .from(questions)
      .where(
        and(eq(questions.dialect, "sqlite"), eq(questions.status, "published")),
      )
      .groupBy(questions.chapter)
      .orderBy(desc(sql`MAX(${questions.lessonNumber})`));
  }),

  getSidebar: publicProcedure.query(async () => {
    const rows = await db
      .select({
        lessonNumber: questions.lessonNumber,
        title: questions.title,
        chapter: questions.chapter,
        sortOrder: questions.sortOrder,
      })
      .from(questions)
      .where(
        and(eq(questions.dialect, "sqlite"), eq(questions.status, "published")),
      )
      .orderBy(asc(questions.lessonNumber), asc(questions.sortOrder));

    // Keep only the first question for each chapter + lesson.
    const uniqueLessons = new Map<
      string,
      {
        lessonNumber: number;
        title: string;
        chapter: string;
      }
    >();

    for (const row of rows) {
      const key = `${row.chapter}-${row.lessonNumber}`;

      if (!uniqueLessons.has(key)) {
        uniqueLessons.set(key, {
          lessonNumber: row.lessonNumber,
          title: row.title,
          chapter: row.chapter,
        });
      }
    }

    return Array.from(uniqueLessons.values()).map((row) => ({
      lessonNumber: row.lessonNumber,
      title: row.title,
      chapters: [row.chapter],
    }));
  }),

  getFirstSqlLesson: publicProcedure.query(async () => {
    const start = performance.now();

    const [lesson] = await db
      .select({
        lessonNumber: questions.lessonNumber,
        title: questions.title,
        chapter: questions.chapter,
      })
      .from(questions)
      .where(eq(questions.status, "published"))
      .orderBy(asc(questions.lessonNumber), asc(questions.sortOrder))
      .limit(1);

    console.log(
      "getFirstSqlLesson query time:",
      (performance.now() - start).toFixed(2),
      "ms",
    );

    return lesson ?? null;
  }),

  getSqlLessonsByChapter: publicProcedure
    .input(
      z.object({
        chapter: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      const rows = await db
        .select({
          lessonNumber: questions.lessonNumber,
          title: questions.title,
          chapter: questions.chapter,
        })
        .from(questions)
        .where(
          and(
            eq(questions.chapter, input.chapter),
            eq(questions.status, "published"),
          ),
        )
        .orderBy(desc(questions.lessonNumber), desc(questions.sortOrder));
      // Group questions by lesson number.
      // Note: title here is a question title, not necessarily a lesson title.
      const lessons = new Map<
        number,
        {
          lessonNumber: number;
          title: string;
          chapter: string;
        }
      >();

      for (const row of rows) {
        if (!lessons.has(row.lessonNumber)) {
          lessons.set(row.lessonNumber, {
            lessonNumber: row.lessonNumber,
            title: row.title,
            chapter: row.chapter,
          });
        }
      }

      return Array.from(lessons.values());
    }),

  getSqlQuestionByLesson: publicProcedure
    .input(
      z.object({
        lessonNumber: z.number().int().positive(),
      }),
    )
    .query(async ({ input }) => {
      const [question] = await db
        .select({
          id: questions.id,
          slug: questions.slug,
          title: questions.title,
          description: questions.description,
          question: questions.question,
          task: questions.task,
          dialect: questions.dialect,
          difficulty: questions.difficulty,
          starterQuery: questions.starterQuery,
          hints: questions.hints,
          tableContext: questions.tableContext,
          expectedOutput: questions.expectedOutput,
          explanation: questions.explanation,
        })
        .from(questions)
        .where(
          and(
            eq(questions.lessonNumber, input.lessonNumber),
            eq(questions.status, "published"),
          ),
        )
        .orderBy(asc(questions.sortOrder))
        .limit(1);

      return question ?? null;
    }),

  runSqlQuery: publicProcedure
    .input(
      z.object({
        questionId: z.number().int().positive(),
        query: z.string().min(1).max(10000),
      }),
    )
    .mutation(async ({ input }) => {
      const [question] = await db
        .select()
        .from(questions)
        .where(eq(questions.id, input.questionId))
        .limit(1);

      if (!question || question.status !== "published") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Question not found",
        });
      }

      const attemptId = randomUUID();

      await sqlQueue.add(
        "evaluate-sql",
        {
          attemptId,
          questionId: input.questionId,
          query: input.query,
        },
        {
          jobId: attemptId,
          attempts: 2,
          backoff: {
            type: "exponential",
            delay: 2000,
          },
          removeOnComplete: {
            age: 3600,
          },
          removeOnFail: {
            age: 86400,
          },
        },
      );
      console.log("runSqlQuery mutation:", attemptId);
      return {
        attemptId,
        status: "queued",
        message: "Your SQL query has been submitted.",
      };
    }),

  getSqlQueryStatus: publicProcedure
    .input(
      z.object({
        attemptId: z.string().uuid(),
      }),
    )
    .query(async ({ input }) => {
      const job = await sqlQueue.getJob(input.attemptId);

      if (!job) {
        return {
          status: "not_found" as const,
          message: "SQL job not found.",
        };
      }

      const state = await job.getState();

      // Worker successfully completed the evaluation.
      if (state === "completed") {
        const output = job.returnvalue;

        if (!output) {
          return {
            status: "failed" as const,
            message: "Worker completed without returning a result.",
          };
        }

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

      // Worker failed after exhausting its retries.
      if (state === "failed") {
        return {
          status: "failed" as const,
          message: job.failedReason || "SQL evaluation failed.",
        };
      }

      // Waiting, active, delayed, etc.
      return {
        status: state,
        message:
          state === "active"
            ? "Executing SQL query..."
            : "Your SQL query is waiting to be processed.",
      };
    }),
});
