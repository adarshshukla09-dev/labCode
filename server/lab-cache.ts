// server/labs-cache.ts
import { unstable_cache } from "next/cache";
import { db } from "@/db/drizzle";
import { questions } from "@/db/drizzle/schema";
import { asc, eq } from "drizzle-orm";

export const getCachedSidebar = unstable_cache(
  () =>
    db
      .select({
        lessonNumber: questions.lessonNumber,
        title: questions.title,
        chapter: questions.chapter,
      })
      .from(questions)
      .where(eq(questions.status, "published"))
      .orderBy(asc(questions.chapter), asc(questions.lessonNumber), asc(questions.sortOrder)),
  ["labs-sidebar"],
  { revalidate: 3600, tags: ["labs-content"] },
);

export const getCachedQuestionByLesson = (lessonNumber: number) =>
  unstable_cache(
    () =>
      db.query.questions.findFirst({
        where: (q, { and, eq }) =>
          and(eq(q.lessonNumber, lessonNumber), eq(q.status, "published")),
        orderBy: (q, { asc }) => [asc(q.sortOrder)],
        columns: {
          id: true, title: true, description: true, task: true,
          difficulty: true, hints: true, tableContext: true,
        },
      }),
    ["labs-question", String(lessonNumber)],
    { revalidate: 3600, tags: ["labs-content"] },
  )();