import { z } from "zod";

export const PollUpdate = z
  .object({
    value: z.boolean().describe("If poll is active or not"),
    bot_id: z.string().describe("Poll bot id"),
  })
  .describe("Event when presentor starts or ends a poll");
export type PollUpdate = z.infer<typeof PollUpdate>;
