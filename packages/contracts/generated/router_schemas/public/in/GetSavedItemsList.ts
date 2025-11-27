import { z } from "zod";

export const GetSavedItemsList = z
  .any()
  .describe("Items that the client saved");
export type GetSavedItemsList = z.infer<typeof GetSavedItemsList>;
