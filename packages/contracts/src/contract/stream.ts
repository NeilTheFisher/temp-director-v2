import { oc } from "@orpc/contract";
import z from "zod";

export const streamContract = {
  getStreamUrls: oc
    .input(
      z.object({
        streamUrlId: z.number().int().positive(),
      }),
    )
    .output(
      z.object({
        urls: z.array(z.string()),
      }),
    ),
};
