import z from "zod";
import { base } from "./base";

export const streamContract = {
  getStreamUrls: base
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
