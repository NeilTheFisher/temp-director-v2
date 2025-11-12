import { eventIterator } from "@orpc/contract";
import z from "zod";
import { base } from "./base";

export const healthContract = {
  ok: base
    .route({
      method: "GET",
    })
    .output(z.string()),
  liveOk: base
    .route({ method: "GET" })
    .input(z.object({ max_outputs: z.number().optional() }))
    .output(eventIterator(z.string())),
};
