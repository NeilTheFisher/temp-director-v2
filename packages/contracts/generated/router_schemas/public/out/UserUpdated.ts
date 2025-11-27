import { z } from "zod";

export const UserUpdated = z
  .object({ userId: z.string().describe("users msisdn") })
  .describe("Event sent when a user gets updated in director");
export type UserUpdated = z.infer<typeof UserUpdated>;
