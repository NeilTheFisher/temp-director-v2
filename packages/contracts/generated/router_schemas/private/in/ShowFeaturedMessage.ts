import { z } from "zod";

export const ShowFeaturedMessage = z
  .object({ messageId: z.string().describe("Message id") })
  .describe("Event when moderator send message to Wall");
export type ShowFeaturedMessage = z.infer<typeof ShowFeaturedMessage>;
