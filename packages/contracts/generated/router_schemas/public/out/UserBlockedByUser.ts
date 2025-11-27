import { z } from "zod";

export const UserBlockedByUser = z
  .object({ userId: z.string().describe("User that has blocked you") })
  .describe("Event sent when a user gets blocked by another user");
export type UserBlockedByUser = z.infer<typeof UserBlockedByUser>;
