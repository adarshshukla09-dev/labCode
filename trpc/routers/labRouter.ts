import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../init";
import { TRPCError } from "@trpc/server";
import { mysqlDb } from "@/db/labs/sqllite";
import { and, asc, eq, sql } from "drizzle-orm";
import { pgDb } from "@/db/labs/postgres";
import { mongooseDb } from "@/db/labs/mongoose";
import { db } from "@/db/drizzle";
import { questions } from "@/db/drizzle/schema";

const QUERY_TIMEOUT = 10_000;
const allowedCollections = ["users", "products"] as const;
const mongoInput = z.discriminatedUnion("operation", [
  z.object({
    collection: z.enum(allowedCollections),
    operation: z.literal("find"),
    filter: z.record(z.string(), z.unknown()).default({}),
  }),
  z.object({
    collection: z.enum(allowedCollections),
    operation: z.literal("findOne"),
    filter: z.record(z.string(), z.unknown()).default({}),
  }),
  z.object({
    collection: z.enum(allowedCollections),
    operation: z.literal("countDocuments"),
    filter: z.record(z.string(), z.unknown()).default({}),
  }),
  z.object({
    collection: z.enum(allowedCollections),
    operation: z.literal("aggregate"),
    pipeline: z.array(z.record(z.string(), z.unknown())).max(20),
  }),
]);

export const labRouter = createTRPCRouter({
 getSqlChapters: publicProcedure.query(async ({ ctx }) => {
    return db
      .select({
        chapter: questions.chapter,
        sortOrder: sql<number>`MIN(${questions.sortOrder})`,
      })
      .from(questions)
      .where(
        and(
          eq(questions.dialect, "sqlite"),
          eq(questions.status, "published")
        )
      )
      .groupBy(questions.chapter)
      .orderBy(asc(sql`MIN(${questions.sortOrder})`));
  }),

getFirstSqlLesson: publicProcedure.query(async () => {
  const [lesson] = await db
    .select({
      id: questions.id,
      lessonNumber: questions.lessonNumber,
      title: questions.title,
    })
    .from(questions)
    .orderBy(asc(questions.sortOrder))
    .limit(1);

  if (!lesson) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No SQL lessons found.",
    });
  }

  return lesson;
}),
 getSqlLessonsByChapter: publicProcedure
    .input(z.object({ chapter: z.string() }))
    .query(async ({ ctx, input }) => {
      return db
        .select({
          id: questions.id,
          title: questions.title,
          lessonNumber: questions.lessonNumber,
          chapter: questions.chapter,
          sortOrder: questions.sortOrder,
        })
        .from(questions)
        .where(
          and(
            eq(questions.chapter, input.chapter),
            eq(questions.dialect, "sqlite"),
            eq(questions.status, "published")
          )
        )
        .orderBy(asc(questions.sortOrder));
    }),

   getSqlQuestionByLesson: publicProcedure
    .input(z.object({ lessonNumber: z.number() }))
    .query(async ({ ctx, input }) => {
      const [question] = await db
        .select({
          id: questions.id,
          title: questions.title,
          description: questions.description,
          question: questions.question,
          task: questions.task,
          difficulty: questions.difficulty,
          points: questions.points,
          hints: questions.hints,
          starterQuery: questions.starterQuery,
          // Include other client-safe workspace fields here.
        })
        .from(questions)
        .where(
          and(
            eq(questions.lessonNumber, input.lessonNumber),
            eq(questions.dialect, "sqlite"),
            eq(questions.status, "published")
          )
        )
        .limit(1);

      return question ?? null;
    }),
});
  // runSqlQuery: protectedProcedure
  //   .input(
  //     z.object({
  //       query: z.string().min(1).max(50_000),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     if (!ctx.session.user) {
  //       throw new TRPCError({
  //         code: "UNAUTHORIZED",
  //       });
  //     }

  //     let timeoutId: ReturnType<typeof setTimeout> | undefined;

  //     try {
  //       const timeoutPromise = new Promise<never>((_, reject) => {
  //         timeoutId = setTimeout(() => {
  //           reject(new Error("QUERY_TIMEOUT"));
  //         }, QUERY_TIMEOUT);
  //       });

  //       const result = await Promise.race([
  //         mysqlDb.execute(sql.raw(input.query)),
  //         timeoutPromise,
  //       ]);

  //       return {
  //         success: true,
  //         data: result,
  //       };
  //     } catch (error) {
  //       if (error instanceof Error && error.message === "QUERY_TIMEOUT") {
  //         throw new TRPCError({
  //           code: "TIMEOUT",
  //           message: "Query execution timed out.",
  //         });
  //       }

  //       console.error("SQL execution failed:", error);

  //       throw new TRPCError({
  //         code: "INTERNAL_SERVER_ERROR",
  //         message: "Failed to execute SQL query.",
  //       });
  //     } finally {
  //       if (timeoutId) {
  //         clearTimeout(timeoutId);
  //       }
  //     }
  //   }),

  // runPgQuery: protectedProcedure
  //   .input(
  //     z.object({
  //       query: z.string().min(1).max(50_000),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     if (!ctx.session.user) {
  //       throw new TRPCError({
  //         code: "UNAUTHORIZED",
  //       });
  //     }

  //     let timeoutId: ReturnType<typeof setTimeout> | undefined;

  //     try {
  //       const timeoutPromise = new Promise<never>((_, reject) => {
  //         timeoutId = setTimeout(() => {
  //           reject(new Error("QUERY_TIMEOUT"));
  //         }, QUERY_TIMEOUT);
  //       });

  //       const result = await Promise.race([
  //         pgDb.execute(sql.raw(input.query)),
  //         timeoutPromise,
  //       ]);

  //       return {
  //         success: true,
  //         data: result,
  //       };
  //     } catch (error) {
  //       if (error instanceof Error && error.message === "QUERY_TIMEOUT") {
  //         throw new TRPCError({
  //           code: "TIMEOUT",
  //           message: "Query execution timed out.",
  //         });
  //       }

  //       console.error("SQL execution failed:", error);

  //       throw new TRPCError({
  //         code: "INTERNAL_SERVER_ERROR",
  //         message: "Failed to execute SQL query.",
  //       });
  //     } finally {
  //       if (timeoutId) {
  //         clearTimeout(timeoutId);
  //       }
  //     }
  //   }),

  // runMongoQuery: protectedProcedure
  //   .input(mongoInput)
  //   .mutation(async ({ ctx, input }) => {
  //     if (!ctx.session.user) {
  //       throw new TRPCError({ code: "UNAUTHORIZED" });
  //     }

  //     try {
  //       const collection = mongooseDb.collection(input.collection);

  //       switch (input.operation) {
  //         case "find": {
  //           const data = await collection
  //             .find(input.filter, { maxTimeMS: QUERY_TIMEOUT })
  //             .limit(100)
  //             .toArray();

  //           return { success: true, data };
  //         }

  //         case "findOne": {
  //           const data = await collection.findOne(input.filter, {
  //             maxTimeMS: QUERY_TIMEOUT,
  //           });

  //           return { success: true, data };
  //         }

  //         case "countDocuments": {
  //           const data = await collection.countDocuments(input.filter, {
  //             maxTimeMS: QUERY_TIMEOUT,
  //           });

  //           return { success: true, data };
  //         }

  //         case "aggregate": {
  //           const data = await collection
  //             .aggregate(input.pipeline, { maxTimeMS: QUERY_TIMEOUT })
  //             .limit(100)
  //             .toArray();

  //           return { success: true, data };
  //         }
  //       }
  //     } catch (error) {
  //       if (
  //         error &&
  //         typeof error === "object" &&
  //         "code" in error &&
  //         error.code === 50
  //       ) {
  //         throw new TRPCError({
  //           code: "TIMEOUT",
  //           message: "MongoDB query execution timed out.",
  //         });
  //       }

  //       console.error("MongoDB query failed:", error);

  //       throw new TRPCError({
  //         code: "INTERNAL_SERVER_ERROR",
  //         message: "Failed to execute MongoDB query.",
  //       });
  //     }
  //   }),

