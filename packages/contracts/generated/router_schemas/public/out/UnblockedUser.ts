import { z } from "zod";

export const UnblockedUser = z
  .object({ userId: z.string().describe("id of blocked user") })
  .describe("Event when user unblocks another user");
export type UnblockedUser = z.infer<typeof UnblockedUser>;
