import { z } from "zod";

export const UserUnblocked = z
  .object({ content: z.string().describe("Reason of unblocking") })
  .describe("Event sent when a user gets unblocked");
export type UserUnblocked = z.infer<typeof UserUnblocked>;
