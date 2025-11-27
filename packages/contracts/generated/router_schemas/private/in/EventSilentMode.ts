import { z } from "zod";

export const EventSilentMode = z
  .object({
    value: z.boolean().describe("If live silent mode is active or not"),
  })
  .describe("Event when moderator turns on/off silent mode");
export type EventSilentMode = z.infer<typeof EventSilentMode>;
