import { z } from "zod";

export const ModeratorJoined = z
  .object({ id: z.string().describe("New moderator's id") })
  .describe("Event sent when a new moderator join the event management");
export type ModeratorJoined = z.infer<typeof ModeratorJoined>;
