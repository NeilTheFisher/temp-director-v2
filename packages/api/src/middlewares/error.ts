import { ORPCError, onError, ValidationError } from "@orpc/server";
import z from "zod";
import { base } from "./base";

export const errorMiddleware = base.middleware(
  onError((error) => {
    if (
      error instanceof ORPCError &&
      error.code === "BAD_REQUEST" &&
      error.cause instanceof ValidationError
    ) {
      // If you only use Zod you can safely cast to ZodIssue[]
      const zodError = new z.ZodError(error.cause.issues as z.core.$ZodIssue[]);

      throw new ORPCError("INPUT_VALIDATION_FAILED", {
        status: 422,
        message: z.prettifyError(zodError),
        data: z.flattenError(zodError),
        cause: error.cause,
      });
    }

    if (
      error instanceof ORPCError &&
      error.code === "INTERNAL_SERVER_ERROR" &&
      error.cause instanceof ValidationError
    ) {
      const zodError = new z.ZodError(error.cause.issues as z.core.$ZodIssue[]);
      throw new ORPCError("OUTPUT_VALIDATION_FAILED", {
        message: z.prettifyError(zodError),
        data: JSON.stringify(z.flattenError(zodError), null, 2),
        cause: error.cause,
      });
    }
  }),
);
