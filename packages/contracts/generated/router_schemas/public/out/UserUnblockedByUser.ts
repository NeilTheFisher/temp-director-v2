import { z } from "zod";

export const UserUnblockedByUser = z
  .object({ userId: z.string().describe("User that has blocked you") })
  .describe("Event sent when a user gets unblocked by another user");
export type UserUnblockedByUser = z.infer<typeof UserUnblockedByUser>;
