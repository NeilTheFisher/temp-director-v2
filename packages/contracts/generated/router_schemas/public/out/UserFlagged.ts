import { z } from "zod";

export const UserFlagged = z
  .object({ content: z.string().describe("Reason of flag") })
  .describe("Event sent when a user gets flagged");
export type UserFlagged = z.infer<typeof UserFlagged>;
