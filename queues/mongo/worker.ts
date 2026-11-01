import "dotenv/config";
import { Worker } from "bullmq";
import { mongoQuestions } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import IORedis from "ioredis";
import { evaluateMongo, MongoQuestion } from "./evaluate";

const redisConnection = new IORedis({
  host: process.env.VALKEY_HOST || "localhost",
  port: Number(process.env.VALKEY_PORT || 6379),
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "mongo-execution",

  async (job) => {
    const { query, questionId } = job.data;

    console.log(`Processing MongoDB job: ${job.id}`);

    // 1. Retrieve question from PostgreSQL (`mongo_queries` table).
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

    if (!question.solution_query) {
      throw new Error("MongoDB Question solution query is missing");
    }

    if (!question.expected_output) {
      throw new Error("MongoDB Question expected output is missing");
    }

    // 2. Create a validated MongoQuestion object.
    const validatedQuestion: MongoQuestion = {
      solution_query: question.solution_query,
      expected_output: question.expected_output,
      points: question.points,
    };
    console.log("Question ID:", questionId);
    console.log("Student query:", query);

    console.log("Solution query:", question.solution_query);

    console.log("Expected output:", question.expected_output);
    // 3. Evaluate student MongoDB query.
    const result = await evaluateMongo(query, validatedQuestion);

    console.log("MongoDB Evaluation completed:", result);

    return result;
  },

  {
    connection: redisConnection,
    concurrency: 3,
  },
);

// -------------------- EVENTS --------------------

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
