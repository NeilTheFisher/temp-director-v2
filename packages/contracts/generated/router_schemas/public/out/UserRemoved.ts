import { z } from "zod";

export const UserRemoved = z
  .object({ content: z.string().describe("Reason of removing") })
  .describe("Event sent when a user gets removed");
export type UserRemoved = z.infer<typeof UserRemoved>;
