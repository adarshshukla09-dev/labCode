import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(
  process.env.VALKEY_URL || "redis://localhost:6379",
  {
    maxRetriesPerRequest: null,
  },
);

export const mongoQueue = new Queue("mongo-execution", {
  connection,
  defaultJobOptions: {
    removeOnComplete: { age: 3600 },
    removeOnFail: { age: 86400 },
  },
});
