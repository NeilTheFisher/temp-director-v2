import { z } from "zod";

export const ShowFeaturedWinner = z
  .any()
  .describe("User")
  .describe("Event when winner of the event sent to the Wall");
export type ShowFeaturedWinner = z.infer<typeof ShowFeaturedWinner>;
