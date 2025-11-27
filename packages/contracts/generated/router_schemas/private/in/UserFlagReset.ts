import { z } from "zod";

export const UserFlagReset = z.object({
  userId: z.string(),
  flagType: z.enum(["message", "video"]),
});
export type UserFlagReset = z.infer<typeof UserFlagReset>;
