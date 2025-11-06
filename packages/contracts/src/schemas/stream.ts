import { z } from "zod";

export const StreamUrlInputSchema = z.object({
  streamUrlId: z.number().int().positive(),
});

export const StreamUrlOutputSchema = z.object({
  urls: z.array(z.string()),
});
