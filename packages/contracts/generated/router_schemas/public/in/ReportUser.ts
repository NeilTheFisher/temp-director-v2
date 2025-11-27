import { z } from "zod";

export const ReportUser = z
  .object({
    userId: z.string().describe("id of reported user"),
    reason: z.string().describe("reason why user is reported").optional(),
  })
  .describe("Event when user reports  another user");
export type ReportUser = z.infer<typeof ReportUser>;
