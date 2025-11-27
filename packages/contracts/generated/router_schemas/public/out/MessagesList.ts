import { z } from "zod";

export const MessagesList = z
  .object({
    list: z.array(
      z.record(z.string(), z.any()).and(
        z
          .object({
            id: z.string().describe("Message Id"),
            creationTimestamp: z
              .number()
              .int()
              .gte(0)
              .describe("Message creation timestamp"),
            onWall: z
              .boolean()
              .describe("If the message was on videowall")
              .optional(),
            status: z
              .enum(["pending", "published", "deleted"])
              .describe("Message status"),
            reason: z.string().describe("Reason of deletion/un-deletion"),
            sender: z.any().describe("User who sent the message"),
            content: z.string().describe("Message content"),
            mentions: z
              .array(
                z.string().describe("Mentions present in the message content"),
              )
              .describe("if there are mentions present"),
          })
          .describe("Message"),
      ),
    ),
  })
  .describe("Event sent to share the list of all messages");
export type MessagesList = z.infer<typeof MessagesList>;
