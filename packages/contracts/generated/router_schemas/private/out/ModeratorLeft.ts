import { z } from "zod";

export const ModeratorLeft = z
  .object({ id: z.string().describe("New moderator's id") })
  .describe("Event sent when a moderator leave the event management");
export type ModeratorLeft = z.infer<typeof ModeratorLeft>;
