import { z } from "zod";

export const Connected = z
  .any()
  .describe("Event sent when a user just connected");
export type Connected = z.infer<typeof Connected>;
