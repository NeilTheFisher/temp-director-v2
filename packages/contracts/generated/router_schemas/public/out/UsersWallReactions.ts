import { z } from "zod";

export const UsersWallReactions = z.object({
  users: z.array(
    z.object({
      reaction: z.string().optional(),
      avatar: z.string().optional(),
    }),
  ),
  total: z.number(),
  level: z.number(),
});
export type UsersWallReactions = z.infer<typeof UsersWallReactions>;
