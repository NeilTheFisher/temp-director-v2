import { z } from "zod";

export const ShowFeaturedMessage = z
  .any()
  .describe("Message")
  .describe("Event when moderator send message to Wall");
export type ShowFeaturedMessage = z.infer<typeof ShowFeaturedMessage>;
