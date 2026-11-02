import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(
  process.env.VALKEY_URL || "redis://localhost:6379",
  {
    maxRetriesPerRequest: null,
  },
);

export const sqlQueue = new Queue("sql-execution", {
  connection,
  defaultJobOptions: {
    removeOnComplete: 3600,
    removeOnFail: 86400,
  },
});
