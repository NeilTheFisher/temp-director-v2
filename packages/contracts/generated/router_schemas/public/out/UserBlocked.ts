import { z } from "zod";

export const UserBlocked = z
  .object({ content: z.string().describe("Reason of blocking") })
  .describe("Event sent when a user get blocked");
export type UserBlocked = z.infer<typeof UserBlocked>;
