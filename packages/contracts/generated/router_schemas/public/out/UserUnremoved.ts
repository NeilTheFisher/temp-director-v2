import { z } from "zod";

export const UserUnremoved = z
  .object({ userId: z.string().describe("userId").optional() })
  .describe("Event sent when a user gets removed");
export type UserUnremoved = z.infer<typeof UserUnremoved>;
