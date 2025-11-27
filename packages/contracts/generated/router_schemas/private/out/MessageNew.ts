import { z } from "zod";

export const MessageNew = z
  .any()
  .describe("Message")
  .describe("Event sent to the moderators when a user send a new message");
export type MessageNew = z.infer<typeof MessageNew>;
