import { z } from "zod";

export const MessageDeleted = z
  .object({
    id: z.string().describe("Message Id to be deleted"),
    senderId: z.string().describe("Sender Id"),
    updateReason: z.string().describe("Message Id to be deleted").default(""),
  })
  .describe("Event sent to delete a message");
export type MessageDeleted = z.infer<typeof MessageDeleted>;
