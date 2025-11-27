import { z } from "zod";

export const HideFeaturedUser = z
  .object({ userId: z.string().describe("User id") })
  .describe("Event when moderator hide featured user on Wall");
export type HideFeaturedUser = z.infer<typeof HideFeaturedUser>;
