import { implement, ORPCError } from "@orpc/server";
import type { Context } from "./context";
import { appContract } from "./contract";

export const pub = implement(appContract).$context<Context>();

export const authed = pub.use(({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  return next({
    context: {
      session: context.session,
    },
  });
});
