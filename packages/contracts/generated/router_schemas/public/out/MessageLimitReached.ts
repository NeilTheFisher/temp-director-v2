import { z } from "zod";

export const MessageLimitReached = z
  .object({
    reason: z.string().describe("Reason why message was deleted"),
    lastMessageSentTimestamp: z
      .number()
      .int()
      .gte(0)
      .describe("Last message that user has sent timestamp"),
    timeInterval: z
      .number()
      .int()
      .gte(0)
      .describe("Interval between every message to be send"),
  })
  .describe("Event sent when a message limit is reached");
export type MessageLimitReached = z.infer<typeof MessageLimitReached>;
