import type { InferInsertModel } from "drizzle-orm";
import seedData from "./seed_mongo_recreated.json";
import { MongoExpectedOutput, mongoQuestions } from "@/db/drizzle/schema";
import { client, db } from "@/db/drizzle";

const DATASET_VERSION = "mongo-lab-v1";

type CollectionContext = {
  collection: string;
  fields: string[];
  description: string;
};

type SeedMongoQuestion = {
  slug: string;
  title: string;
  description: string;
  question: string;
  task: string;
  chapter: string;
  lesson_number: number;
  difficulty: "easy" | "medium" | "hard";
  points: number;
  sort_order: number;
  starter_query: string | null;
  solution_query: string;
  explanation: string;
  hints: string[];
  collection_context: CollectionContext[];
  expected_output: MongoExpectedOutput | null;
};

type MongoQuestionInsert = InferInsertModel<typeof mongoQuestions>;

async function seedMongo() {
  try {
    const data = seedData as SeedMongoQuestion[];

    for (const q of data) {
      const values = {
        slug: q.slug,
        title: q.title,
        description: q.description,
        question: q.question,
        task: q.task,
        difficulty: q.difficulty,
        starterQuery: q.starter_query,
        solutionQuery: q.solution_query,
        explanation: q.explanation,
        hints: q.hints,
        expectedOutput: q.expected_output,
        datasetVersion: DATASET_VERSION,
        status: "published",
        points: q.points ?? 10,
        sortOrder: q.sort_order ?? q.lesson_number,
        chapter: q.chapter,
        lessonNumber: q.lesson_number,
        collectionContext: q.collection_context,
      } satisfies MongoQuestionInsert;

      await db
        .insert(mongoQuestions)
        .values(values)
        .onConflictDoUpdate({
          target: mongoQuestions.slug,
          set: {
            title: values.title,
            description: values.description,
            question: values.question,
            task: values.task,
            difficulty: values.difficulty,
            starterQuery: values.starterQuery,
            solutionQuery: values.solutionQuery,
            explanation: values.explanation,
            hints: values.hints,
            expectedOutput: values.expectedOutput,
            datasetVersion: values.datasetVersion,
            status: values.status,
            points: values.points,
            sortOrder: values.sortOrder,
            chapter: values.chapter,
            lessonNumber: values.lessonNumber,
            collectionContext: values.collectionContext,
            updatedAt: new Date(),
          },
        });
    }

    console.log(`Successfully seeded ${seedData.length} MongoDB questions.`);
  } catch (error) {
    console.error("Failed to seed MongoDB questions:", error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

seedMongo();
