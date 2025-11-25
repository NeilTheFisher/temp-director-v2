import { eventIterator } from "@orpc/contract";
import z from "zod";
import { base } from "./base";

export const healthContract = base.prefix("/").router({
  ok: base
    .route({
      path: "/health",
      method: "GET",
    })
    .input(z.unknown())
    .output(z.string()),
  liveOk: base
    .route({ method: "GET" })
    .input(z.object({ max_outputs: z.number().optional() }))
    .output(eventIterator(z.string())),
});
