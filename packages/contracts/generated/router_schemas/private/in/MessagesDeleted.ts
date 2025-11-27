import { z } from "zod";

export const MessagesDeleted = z
  .any()
  .describe("Event when moderator deletes all the messages from an event");
export type MessagesDeleted = z.infer<typeof MessagesDeleted>;
