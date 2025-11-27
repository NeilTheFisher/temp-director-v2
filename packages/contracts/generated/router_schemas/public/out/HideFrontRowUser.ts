import { z } from "zod";

export const HideFrontRowUser = z
  .object({ id: z.string().describe("User id") })
  .describe("Event sent when a user is removed from front row");
export type HideFrontRowUser = z.infer<typeof HideFrontRowUser>;
