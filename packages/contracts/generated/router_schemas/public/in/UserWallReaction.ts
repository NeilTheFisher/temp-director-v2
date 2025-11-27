import { z } from "zod";

export const UserWallReaction = z.object({ reaction: z.string() });
export type UserWallReaction = z.infer<typeof UserWallReaction>;
