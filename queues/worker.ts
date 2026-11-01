import "dotenv/config";

import { Worker } from "bullmq";

import { evaluateSql } from "@/ingestion/evaluate";
import type { Question } from "@/ingestion/evaluate";

import { questions } from "@/db/drizzle/schema/labs";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";

import { redisConnection } from "@/queues/redis";

const worker = new Worker(
  "sql-execution",

  async (job) => {
    const { query, questionId } = job.data;

    console.log(`Processing SQL job: ${job.id}`);

    // 1. Retrieve question from PostgreSQL.
    const [question] = await db
      .select({
        solution_query: questions.solutionQuery,
        expected_output: questions.expectedOutput,
        points: questions.points,
      })
      .from(questions)
      .where(eq(questions.id, questionId))
      .limit(1);

    if (!question) {
      throw new Error("Question not found");
    }

    if (!question.solution_query) {
      throw new Error("Question solution query is missing");
    }

    if (!question.expected_output) {
      throw new Error("Question expected output is missing");
    }

    // 2. Create a validated Question object.
    const validatedQuestion: Question = {
      solution_query: question.solution_query,
      expected_output: question.expected_output,
      points: question.points,
    };

    // 3. Evaluate student SQL.
    const result = await evaluateSql(query, validatedQuestion);

    console.log("Evaluation completed:", result);

    return result;
  },

  {
    connection: redisConnection,
    concurrency: 3,
  },
);

// -------------------- EVENTS --------------------

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} failed:`, error);
});

worker.on("error", (error) => {
  console.error("Worker error:", error);
});

console.log("SQL worker started...");
