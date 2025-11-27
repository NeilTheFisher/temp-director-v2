import { z } from "zod";

export const ReportedUser = z
  .object({ userId: z.string().describe("id of reported user") })
  .describe("Event when user reports  another user");
export type ReportedUser = z.infer<typeof ReportedUser>;
