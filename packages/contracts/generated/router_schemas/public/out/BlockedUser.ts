import { z } from "zod";

export const BlockedUser = z
  .object({ userId: z.string().describe("id of blocked user") })
  .describe("Event when user blocks another user");
export type BlockedUser = z.infer<typeof BlockedUser>;
