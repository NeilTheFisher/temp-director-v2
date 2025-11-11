import { oc } from "@orpc/contract";
import z from "zod";

export const base = oc.errors({
  NOT_IMPLEMENTED: {
    data: z.any(),
    message: "Not implemented",
    status: 500,
  },
});
