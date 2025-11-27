import { z } from "zod";

export const StreamOnStandby = z
  .object({
    code: z.string().describe("ricoh camera device id"),
    userId: z.string().describe("msisdn of a user that is using the camera"),
  })
  .describe("Event when camera wants to notify users its on standby");
export type StreamOnStandby = z.infer<typeof StreamOnStandby>;
