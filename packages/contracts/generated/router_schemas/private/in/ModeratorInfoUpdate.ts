import { z } from "zod";

export const ModeratorInfoUpdate = z.object({
  name: z.string(),
  avatar: z.string(),
});
export type ModeratorInfoUpdate = z.infer<typeof ModeratorInfoUpdate>;
