import { db } from "@/db/drizzle";
import { mongoQuestions } from "@/db/drizzle/schema";
import { mongoQueue } from "@/queues/mongo/producer";

import { createTRPCRouter, publicProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";

import { and, asc, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

export const mongoLabRouter = createTRPCRouter({
  getMongoChapters: publicProcedure.query(async () => {
    return db
      .select({
        chapter: mongoQuestions.chapter,
        sortOrder: sql<number>`MAX(${mongoQuestions.lessonNumber})`,
      })
      .from(mongoQuestions)
      .where(eq(mongoQuestions.status, "published"))
      .groupBy(mongoQuestions.chapter)
      .orderBy(desc(sql`MAX(${mongoQuestions.lessonNumber})`));
  }),

  getSidebar: publicProcedure.query(async () => {
    const rows = await db
      .select({
        lessonNumber: mongoQuestions.lessonNumber,
        title: mongoQuestions.title,
        chapter: mongoQuestions.chapter,
        sortOrder: mongoQuestions.sortOrder,
      })
      .from(mongoQuestions)
      .where(eq(mongoQuestions.status, "published"))
      .orderBy(asc(mongoQuestions.lessonNumber), asc(mongoQuestions.sortOrder));

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

  getFirstMongoLesson: publicProcedure.query(async () => {
    const start = performance.now();

    const [lesson] = await db
      .select({
        lessonNumber: mongoQuestions.lessonNumber,
        title: mongoQuestions.title,
        chapter: mongoQuestions.chapter,
      })
      .from(mongoQuestions)
      .where(eq(mongoQuestions.status, "published"))
      .orderBy(asc(mongoQuestions.lessonNumber), asc(mongoQuestions.sortOrder))
      .limit(1);

    console.log(
      "getFirstMongoLesson query time:",
      (performance.now() - start).toFixed(2),
      "ms",
    );

    return lesson ?? null;
  }),

  getMongoLessonsByChapter: publicProcedure
    .input(
      z.object({
        chapter: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      const rows = await db
        .select({
          lessonNumber: mongoQuestions.lessonNumber,
          title: mongoQuestions.title,
          chapter: mongoQuestions.chapter,
        })
        .from(mongoQuestions)
        .where(
          and(
            eq(mongoQuestions.chapter, input.chapter),
            eq(mongoQuestions.status, "published"),
          ),
        )
        .orderBy(
          desc(mongoQuestions.lessonNumber),
          desc(mongoQuestions.sortOrder),
        );

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

  getMongoQuestionByLesson: publicProcedure
    .input(
      z.object({
        lessonNumber: z.number().int().positive(),
      }),
    )
    .query(async ({ input }) => {
      const [question] = await db
        .select({
          id: mongoQuestions.id,
          slug: mongoQuestions.slug,
          title: mongoQuestions.title,
          description: mongoQuestions.description,
          question: mongoQuestions.question,
          task: mongoQuestions.task,
          difficulty: mongoQuestions.difficulty,
          starterQuery: mongoQuestions.starterQuery,
          hints: mongoQuestions.hints,
          collectionContext: mongoQuestions.collectionContext,
          expectedOutput: mongoQuestions.expectedOutput,
          explanation: mongoQuestions.explanation,
        })
        .from(mongoQuestions)
        .where(
          and(
            eq(mongoQuestions.lessonNumber, input.lessonNumber),
            eq(mongoQuestions.status, "published"),
          ),
        )
        .orderBy(asc(mongoQuestions.sortOrder))
        .limit(1);

      return question ?? null;
    }),

  getMongoQueryStatus: publicProcedure
    .input(
      z.object({
        attemptId: z.string().uuid(),
      }),
    )
    .query(async ({ input }) => {
      // Retrieve the job from the actual mongoQueue with proper typing
      const job = await mongoQueue.getJob(input.attemptId);

      if (!job) {
        return {
          status: "not_found" as const,
          message: "MongoDB job not found.",
        };
      }

      const state = await job.getState();

      if (state === "completed") {
        // Explicitly type or cast returnvalue if needed
        const output = job.returnvalue as {
          message: string;
          result?: {
            columns: string[];
            rows: Record<string, unknown>[];
            rowCount: number;
          };
          isCorrect: boolean;
          score: number;
          totalPoints: number;
          matchType: string;
        } | null;

        if (!output) {
          return {
            status: "failed" as const,
            message: "Worker completed without returning a result.",
          };
        }

        return {
          status: "completed" as const,
          message: output.message,
          result: output.result || null,
          evaluation: {
            isCorrect: output.isCorrect,
            score: output.score,
            totalPoints: output.totalPoints,
            matchType: output.matchType,
            message: output.message,
          },
        };
      }

      if (state === "failed") {
        return {
          status: "failed" as const,
          message: job.failedReason || "MongoDB evaluation failed.",
        };
      }

      return {
        status: state,
        message:
          state === "active"
            ? "Executing MongoDB query..."
            : "Your MongoDB query is waiting to be processed.",
      };
    }),
});
