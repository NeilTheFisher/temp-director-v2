import { z } from "zod";

export const MessagePending = z
  .any()
  .describe("Message")
  .describe(
    "Event sent back to the user when the message has been receive by the server",
  );
export type MessagePending = z.infer<typeof MessagePending>;
