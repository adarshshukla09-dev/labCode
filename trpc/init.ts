import "server-only";

import { initTRPC } from "@trpc/server";
import { auth } from "@/lib/auth";
import { TRPCError } from "@trpc/server";

export async function createTRPCContext({ headers }: { headers?: Headers } = {}) {
  const session = headers ? await auth.api.getSession({ headers }) : null;
  return { session };
}

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Sign in to run a lab query." });
  }
  return next({ ctx: { ...ctx, session: ctx.session } });
});
