import { z } from "zod";

export const PollDisplayed = z
  .object({
    value: z.boolean().describe("If poll is displayed or not"),
    expanded: z.boolean().describe("if the poll is expanded or not"),
  })
  .describe("Event when poll is displayed or hidden on video wall");
export type PollDisplayed = z.infer<typeof PollDisplayed>;
