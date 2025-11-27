import { z } from "zod";

export const MessageStatusUpdate = z
  .any()
  .describe("Message")
  .describe("Event sent to the moderators when a message status is updated");
export type MessageStatusUpdate = z.infer<typeof MessageStatusUpdate>;
