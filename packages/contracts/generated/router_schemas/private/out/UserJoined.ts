import { z } from "zod";

export const UserJoined = z
  .any()
  .describe("User")
  .describe("Event sent went a user join the event");
export type UserJoined = z.infer<typeof UserJoined>;
