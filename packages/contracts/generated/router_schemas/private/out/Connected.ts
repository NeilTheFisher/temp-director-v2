import { z } from "zod";

export const Connected = z
  .any()
  .describe("Event sent on back to the moderator on successful connection");
export type Connected = z.infer<typeof Connected>;
