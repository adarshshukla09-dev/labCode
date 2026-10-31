import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../init";
import { labRouter } from "./labRouter";
export const appRouter = createTRPCRouter({
  labRouter: labRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
