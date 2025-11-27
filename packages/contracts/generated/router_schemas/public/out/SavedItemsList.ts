import { z } from "zod";

export const SavedItemsList = z
  .any()
  .describe("User")
  .describe("Event sent to share the list of saved items");
export type SavedItemsList = z.infer<typeof SavedItemsList>;
