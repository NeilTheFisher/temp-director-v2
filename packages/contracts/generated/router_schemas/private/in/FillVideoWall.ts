import { z } from "zod";

export const FillVideoWall = z
  .object({
    deviceId: z.string().describe("device to fill"),
    vipsOnly: z.boolean().describe("whether to only invite VIP users").optional(),
  })
  .describe("Event when moderator wants to fill videowall");
export type FillVideoWall = z.infer<typeof FillVideoWall>;
