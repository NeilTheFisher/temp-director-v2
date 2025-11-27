import { z } from "zod";

export const UserFlagIncrement = z.object({
  userId: z.string(),
  flagType: z.enum(["message", "video", "user"]),
});
export type UserFlagIncrement = z.infer<typeof UserFlagIncrement>;
