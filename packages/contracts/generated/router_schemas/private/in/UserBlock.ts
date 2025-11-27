import { z } from "zod";

export const UserBlock = z.object({
  userId: z.string(),
  reason: z.string().optional(),
});
export type UserBlock = z.infer<typeof UserBlock>;
