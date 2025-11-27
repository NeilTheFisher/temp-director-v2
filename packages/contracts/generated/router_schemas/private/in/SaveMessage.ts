import { z } from "zod";

export const SaveMessage = z
  .object({
    messageId: z.string().describe("Message id"),
    value: z.boolean().describe("true/false if save/unsaved"),
  })
  .describe("Event when moderator send message to Wall");
export type SaveMessage = z.infer<typeof SaveMessage>;
