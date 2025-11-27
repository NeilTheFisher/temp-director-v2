import { z } from "zod";

export const MessagePublished = z
  .any()
  .describe("Message")
  .describe(
    "Event sent to everybody (Moderators and Users) when a message is approved by a moderator",
  );
export type MessagePublished = z.infer<typeof MessagePublished>;
