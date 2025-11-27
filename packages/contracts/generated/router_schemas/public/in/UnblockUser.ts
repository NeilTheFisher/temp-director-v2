import { z } from "zod";

export const UnblockUser = z
  .object({ userId: z.string().describe("id of blocked user") })
  .describe("Event when user unblocks another user");
export type UnblockUser = z.infer<typeof UnblockUser>;
