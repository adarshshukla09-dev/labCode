import { createTRPCRouter } from "../init";
import { labContentRouter } from "./lab-content.router";
import { sqlRouter } from "./sql/sql.router";
import { mongodbRouter } from "./mongo/mongo.router";

export const labRouter = createTRPCRouter({
  content: labContentRouter,
  sql: sqlRouter,
  mongodb: mongodbRouter,
});

export const appRouter = createTRPCRouter({ lab: labRouter });
export type AppRouter = typeof appRouter;
