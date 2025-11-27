import { z } from "zod";

export const UserLeft = z
  .any()
  .describe("User")
  .describe("Event sent went a user leave the event");
export type UserLeft = z.infer<typeof UserLeft>;
