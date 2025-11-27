import { z } from "zod";

export const PollUpdated = z
  .object({
    value: z.boolean().describe("If poll is displayed or not"),
    bot_id: z.string().describe("the poll bot id that was updated"),
  })
  .describe("Event when poll is started or stopped");
export type PollUpdated = z.infer<typeof PollUpdated>;
