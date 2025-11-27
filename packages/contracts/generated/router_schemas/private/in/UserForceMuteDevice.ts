import { z } from "zod";

export const UserForceMuteDevice = z
  .object({
    value: z.boolean().describe("If user is muted or not"),
    userId: z.string().describe("user that will be muted"),
    deviceId: z.string().describe("device that will be muted"),
  })
  .describe("Event when moderator moderator mutes the user on wall");
export type UserForceMuteDevice = z.infer<typeof UserForceMuteDevice>;
