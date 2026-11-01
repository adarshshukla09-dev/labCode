import { db } from "@/db/drizzle";
import { mongoQuestions, questions } from "@/db/drizzle/schema";
import { createTRPCRouter, publicProcedure } from "@/trpc/init";
import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";

export const labSlugSchema = z.enum(["sql", "mongodb"]);
const lessonInput = z.object({
  lab: labSlugSchema,
  chapter: z.string().min(1),
  lessonNumber: z.number().int().positive(),
});

type LabLesson = { lessonNumber: number; title: string; chapter: string };
type LabQuestion = {
  id: number;
  slug: string;
  lessonNumber: number;
  chapter: string;
  title: string;
  description: string | null;
  question: string;
  task: string;
  difficulty: "easy" | "medium" | "hard";
  starterQuery: string | null;
  hints: string[];
  context: unknown;
  expectedOutput: unknown;
  explanation: string | null;
};

async function getLessons(lab: z.infer<typeof labSlugSchema>): Promise<LabLesson[]> {
  const rows = lab === "sql"
    ? await db.select({ lessonNumber: questions.lessonNumber, title: questions.title, chapter: questions.chapter, sortOrder: questions.sortOrder })
      .from(questions).where(and(eq(questions.dialect, "sqlite"), eq(questions.status, "published")))
      .orderBy(asc(questions.lessonNumber), asc(questions.sortOrder))
    : await db.select({ lessonNumber: mongoQuestions.lessonNumber, title: mongoQuestions.title, chapter: mongoQuestions.chapter, sortOrder: mongoQuestions.sortOrder })
      .from(mongoQuestions).where(eq(mongoQuestions.status, "published"))
      .orderBy(asc(mongoQuestions.lessonNumber), asc(mongoQuestions.sortOrder));

  const lessonMap = new Map<string, LabLesson>();
  for (const row of rows) {
    const key = `${row.chapter}:${row.lessonNumber}`;
    if (!lessonMap.has(key)) lessonMap.set(key, { lessonNumber: row.lessonNumber, title: row.title, chapter: row.chapter });
  }
  return [...lessonMap.values()];
}

export const labContentRouter = createTRPCRouter({
  getChapters: publicProcedure.input(z.object({ lab: labSlugSchema })).query(async ({ input }) => {
    const lessons = await getLessons(input.lab);
    return [...new Set(lessons.map(({ chapter }) => chapter))];
  }),
  getSidebar: publicProcedure.input(z.object({ lab: labSlugSchema })).query(async ({ input }) => getLessons(input.lab)),
  getFirstLesson: publicProcedure.input(z.object({ lab: labSlugSchema })).query(async ({ input }) => {
    const [first] = await getLessons(input.lab);
    return first ?? null;
  }),
  getLessonsByChapter: publicProcedure.input(z.object({ lab: labSlugSchema, chapter: z.string().min(1) })).query(async ({ input }) =>
    (await getLessons(input.lab)).filter((lesson) => lesson.chapter === input.chapter)),
  getQuestionByLesson: publicProcedure.input(lessonInput).query(async ({ input }): Promise<LabQuestion | null> => {
    if (input.lab === "sql") {
      const [row] = await db.select().from(questions).where(and(
        eq(questions.chapter, input.chapter), eq(questions.lessonNumber, input.lessonNumber),
        eq(questions.dialect, "sqlite"), eq(questions.status, "published"),
      )).orderBy(asc(questions.sortOrder)).limit(1);
      return row ? { id: row.id, slug: row.slug, lessonNumber: row.lessonNumber, chapter: row.chapter,
        title: row.title, description: row.description, question: row.question, task: row.task,
        difficulty: row.difficulty, starterQuery: row.starterQuery, hints: row.hints,
        context: row.tableContext, expectedOutput: row.expectedOutput, explanation: row.explanation } : null;
    }
    const [row] = await db.select().from(mongoQuestions).where(and(
      eq(mongoQuestions.chapter, input.chapter), eq(mongoQuestions.lessonNumber, input.lessonNumber),
      eq(mongoQuestions.status, "published"),
    )).orderBy(asc(mongoQuestions.sortOrder)).limit(1);
    return row ? { id: row.id, slug: row.slug, lessonNumber: row.lessonNumber, chapter: row.chapter,
      title: row.title, description: row.description, question: row.question, task: row.task,
      difficulty: row.difficulty, starterQuery: row.starterQuery, hints: row.hints,
      context: row.collectionContext, expectedOutput: row.expectedOutput, explanation: row.explanation } : null;
  }),
});
