import { z } from "zod";

export const SaveItemToList = z.object({
  itemId: z.string().describe("Item Id"),
  description: z.string().describe("item description").default(""),
});
export type SaveItemToList = z.infer<typeof SaveItemToList>;
