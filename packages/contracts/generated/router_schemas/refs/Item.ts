import { z } from "zod";

export const Item = z
  .object({
    itemId: z.string().describe("Item Id"),
    description: z.string().describe("Item note"),
  })
  .describe("User");
export type Item = z.infer<typeof Item>;
