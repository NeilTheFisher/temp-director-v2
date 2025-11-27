import { z } from "zod";

export const UserLeft = z
  .object({ user_id: z.string().describe("user id") })
  .describe("Event sent went a user leave the event");
export type UserLeft = z.infer<typeof UserLeft>;
