import { z } from "zod";

export const MessageStatusUpdate = z.object({
  messageId: z.string(),
  messageStatus: z.enum(["published", "deleted"]),
  updateReason: z.string().optional(),
});
export type MessageStatusUpdate = z.infer<typeof MessageStatusUpdate>;
