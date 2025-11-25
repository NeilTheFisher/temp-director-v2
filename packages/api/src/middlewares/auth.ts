import { ORPCError } from "@orpc/server";
import { base } from "./1_base";

export const authMiddleware = base.middleware(({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED", {
      message: "User not authenticated",
    });
  }

  return next({
    context: {
      session: context.session,
    },
  });
});
