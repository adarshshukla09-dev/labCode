import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
  host: process.env.VALKEY_HOST || "localhost",
  port: Number(process.env.VALKEY_PORT || 6379),
  maxRetriesPerRequest: null,
});

export const mongoQueue = new Queue("mongo-execution", {
  connection,
  defaultJobOptions: {
    removeOnComplete: { age: 3600 },
    removeOnFail: { age: 86400 },
  },
});
