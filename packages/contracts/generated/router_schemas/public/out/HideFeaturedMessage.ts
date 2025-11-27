import { z } from "zod";

export const HideFeaturedMessage = z
  .object({ messageId: z.string().describe("Message id").optional() })
  .describe("Event when moderator remove message to Wall");
export type HideFeaturedMessage = z.infer<typeof HideFeaturedMessage>;
