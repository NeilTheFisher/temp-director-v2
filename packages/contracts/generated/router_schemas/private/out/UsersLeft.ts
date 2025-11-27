import { z } from "zod";

export const UsersLeft = z
  .object({ list: z.array(z.string()) })
  .describe("Event sent to share the list of all users");
export type UsersLeft = z.infer<typeof UsersLeft>;
