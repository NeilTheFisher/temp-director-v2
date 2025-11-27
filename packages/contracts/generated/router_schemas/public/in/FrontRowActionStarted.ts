import { z } from "zod";

export const FrontRowActionStarted = z
  .object({ userId: z.string().describe("user id to send the action to") })
  .describe("Event when front row takes a picture");
export type FrontRowActionStarted = z.infer<typeof FrontRowActionStarted>;
