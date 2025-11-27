import { z } from "zod";

export const FillVideoWall = z
  .object({ count: z.number().describe("count of spots filled") })
  .describe("Event returned when videowall was filled");
export type FillVideoWall = z.infer<typeof FillVideoWall>;
