import { z } from "zod";

export const FrontRowActionStart = z
  .object({ sip: z.string().describe("front row who triggered the action") })
  .describe("Event when front row started an action");
export type FrontRowActionStart = z.infer<typeof FrontRowActionStart>;
