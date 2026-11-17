import "dotenv/config";

import { Worker } from "bullmq";
import { eq } from "drizzle-orm";

import { mongoQuestions } from "@/db/drizzle/schema";
import { db } from "@/db/drizzle";

import { evaluateMongo, MongoQuestion } from "./evaluate";
import { createRedisConnection } from "@/queues/connection/redis";

const worker = new Worker(
  "mongo-execution",

  async (job) => {
    const { query, questionId } = job.data;

    console.log(`Processing MongoDB job: ${job.id}`);

    const [question] = await db
      .select({
        solution_query: mongoQuestions.solutionQuery,
        expected_output: mongoQuestions.expectedOutput,
        points: mongoQuestions.points,
      })
      .from(mongoQuestions)
      .where(eq(mongoQuestions.id, questionId))
      .limit(1);

    if (!question) {
      throw new Error("MongoDB Question not found");
    }

    if (!question.solution_query || !question.expected_output) {
      throw new Error("Question solution or expected output is missing");
    }

    const validatedQuestion: MongoQuestion = {
      solution_query: question.solution_query,
      expected_output: question.expected_output,
      points: question.points,
    };

    const result = await evaluateMongo(query, validatedQuestion);

    console.log("MongoDB Evaluation completed:", result);

    return result;
  },

  {
    connection: createRedisConnection(),
    concurrency: 3,
  },
);

worker.on("completed", (job) => {
  console.log(`MongoDB Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.error(`MongoDB Job ${job?.id} failed:`, error);
});

worker.on("error", (error) => {
  console.error("MongoDB Worker error:", error);
});

console.log("MongoDB worker started...");
