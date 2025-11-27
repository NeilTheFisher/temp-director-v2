import { z } from "zod";

export const ShowItem = z
  .object({
    itemId: z
      .string()
      .describe("item id of the item that presenter is talking about"),
  })
  .describe("Event when moderator forces user to watch a stream");
export type ShowItem = z.infer<typeof ShowItem>;
