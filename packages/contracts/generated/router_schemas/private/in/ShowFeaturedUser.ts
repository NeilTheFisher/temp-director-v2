import { z } from "zod";

export const ShowFeaturedUser = z
  .object({ userId: z.string().describe("User id") })
  .describe("Event when moderator features user on Wall");
export type ShowFeaturedUser = z.infer<typeof ShowFeaturedUser>;
