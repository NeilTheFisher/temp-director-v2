import { z } from "zod";

export const GetEventUserCount = z
  .any()
  .describe("Event when user wants to get counts for users and guests");
export type GetEventUserCount = z.infer<typeof GetEventUserCount>;
