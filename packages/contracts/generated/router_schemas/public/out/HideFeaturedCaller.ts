import { z } from "zod";

export const HideFeaturedCaller = z
  .object({
    id: z.string().describe("User id"),
    sip: z.string().describe("wall sip assigned to that user"),
    deviceId: z.string().describe("User's deviceId"),
  })
  .describe("Event when moderator removes featured user on Wall");
export type HideFeaturedCaller = z.infer<typeof HideFeaturedCaller>;
