import { z } from "zod";

export const BlockUser = z
  .object({ userId: z.string().describe("id of blocked user") })
  .describe("Event when user blocks  another user");
export type BlockUser = z.infer<typeof BlockUser>;
