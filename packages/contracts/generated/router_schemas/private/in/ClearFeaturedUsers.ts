import { z } from "zod";

export const ClearFeaturedUsers = z
  .any()
  .describe("Event when presentor clears all featured users");
export type ClearFeaturedUsers = z.infer<typeof ClearFeaturedUsers>;
