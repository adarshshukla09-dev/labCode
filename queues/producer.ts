import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
  host: process.env.VALKEY_HOST || "localhost",
  port: Number(process.env.VALKEY_PORT || 6379),
  maxRetriesPerRequest: null,
});

export const sqlQueue = new Queue("sql-execution", {
  connection,
  defaultJobOptions: {
    removeOnComplete: 3600,
    removeOnFail: 86400,
  },
});
