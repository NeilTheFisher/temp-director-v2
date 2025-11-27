import { z } from "zod";

export const UserWallReaction = z.object({
  reaction: z.string(),
  user_id: z.string(),
});
export type UserWallReaction = z.infer<typeof UserWallReaction>;
