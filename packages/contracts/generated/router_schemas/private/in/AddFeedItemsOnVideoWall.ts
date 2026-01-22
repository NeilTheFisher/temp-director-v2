import { z } from "zod";

export const AddFeedItemsOnVideoWall = z
  .array(
    z.object({
      productId: z.string(),
      productUrl: z.string(),
      productTitle: z.string(),
      productImage: z.string(),
      productDescription: z.string(),
    })
  )
  .describe("When presenter wants to send items to video wall");
export type AddFeedItemsOnVideoWall = z.infer<typeof AddFeedItemsOnVideoWall>;
