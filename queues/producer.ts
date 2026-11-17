import { Queue } from "bullmq";
import { createRedisConnection } from "@/queues/connection/redis";

export const sqlQueue = new Queue("sql-execution", {
  connection: createRedisConnection(),

  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 2000,
    },

    removeOnComplete: { age: 3600 },
    removeOnFail: { age: 86400 },
  },
});
