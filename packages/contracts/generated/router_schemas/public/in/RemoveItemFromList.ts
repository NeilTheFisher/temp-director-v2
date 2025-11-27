import { z } from "zod";

export const RemoveItemFromList = z.object({
  itemId: z.string().describe("Item Id"),
});
export type RemoveItemFromList = z.infer<typeof RemoveItemFromList>;
