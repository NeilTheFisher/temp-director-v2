import { ORPCError } from "@orpc/server";
import { pub } from "./pub";

export const authMiddleware = pub.middleware(({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  return next({
    context: {
      session: context.session,
    },
  });
});
