import IORedis from "ioredis";

export const redisConnection = new IORedis(
  process.env.VALKEY_URL || "redis://localhost:6379",
  {
    maxRetriesPerRequest: null,
  },
);
