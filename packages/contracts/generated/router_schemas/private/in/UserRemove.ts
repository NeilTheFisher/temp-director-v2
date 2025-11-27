import { z } from "zod";

export const UserRemove = z.object({
  userId: z.string(),
  reason: z.string().optional(),
});
export type UserRemove = z.infer<typeof UserRemove>;
