import { z } from "zod";

export const MessageRejected = z
  .any()
  .describe("Message")
  .describe(
    "Event sent to the User when the message has been rejected by a moderator",
  );
export type MessageRejected = z.infer<typeof MessageRejected>;
