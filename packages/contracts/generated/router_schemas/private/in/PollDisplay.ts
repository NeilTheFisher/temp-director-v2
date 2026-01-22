import { z } from "zod";

export const PollDisplay = z
  .object({
    value: z.boolean().describe("If poll is displayed or not"),
    expanded: z.boolean().describe("if the poll is expanded or not"),
  })
  .describe("Event when presenter starts wants to display or hide poll on video wall");
export type PollDisplay = z.infer<typeof PollDisplay>;
