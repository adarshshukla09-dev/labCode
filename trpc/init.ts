import "server-only";

import { initTRPC } from "@trpc/server";
import { TRPCError } from "@trpc/server";

export async function createTRPCContext() {
  return {};
}

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ next }) => {
  throw new TRPCError({
    code: "UNAUTHORIZED",
    message: "Authentication is not enabled.",
  });
});
