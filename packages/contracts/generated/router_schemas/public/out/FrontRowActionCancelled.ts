import { z } from "zod";

export const FrontRowActionCancelled = z
  .object({ sip: z.string().describe("user id to send the action to") })
  .describe("Event when front row takes a picture");
export type FrontRowActionCancelled = z.infer<typeof FrontRowActionCancelled>;
