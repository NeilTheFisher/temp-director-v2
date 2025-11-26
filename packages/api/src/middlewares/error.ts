import { ORPCError, onError, ValidationError } from "@orpc/server";
import { base } from "./1_base";

export const errorMiddleware = base.middleware(
  onError((error) => {
    if (
      error instanceof ORPCError &&
      error.code === "BAD_REQUEST" &&
      error.cause instanceof ValidationError
    ) {
      throw new ORPCError("INPUT_VALIDATION_FAILED", {
        status: 422,
        message: "Input validation failed",
        data: error.cause.issues,
        cause: error.cause,
      });
    }

    if (
      error instanceof ORPCError &&
      error.code === "INTERNAL_SERVER_ERROR" &&
      error.cause instanceof ValidationError
    ) {
      throw new ORPCError("OUTPUT_VALIDATION_FAILED", {
        message: "Output validation failed",
        data: error.cause.issues,
        cause: error.cause,
      });
    }
  }),
);
