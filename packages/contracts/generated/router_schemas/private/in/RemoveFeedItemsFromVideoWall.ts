import { z } from "zod";

export const RemoveFeedItemsFromVideoWall = z.object({
  items: z
    .array(z.any())
    .describe("Event when presentor wants to remove items from video wall")
    .optional(),
});
export type RemoveFeedItemsFromVideoWall = z.infer<
  typeof RemoveFeedItemsFromVideoWall
>;
