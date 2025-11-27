import { z } from "zod";

export const ModeratorInfoUpdate = z
  .any()
  .describe("Moderator")
  .describe("Event sent when a moderator have been updated");
export type ModeratorInfoUpdate = z.infer<typeof ModeratorInfoUpdate>;
