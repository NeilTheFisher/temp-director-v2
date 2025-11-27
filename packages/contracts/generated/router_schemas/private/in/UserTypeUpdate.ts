import { z } from "zod";

export const UserTypeUpdate = z.object({
  userId: z.string(),
  type: z.string(),
});
export type UserTypeUpdate = z.infer<typeof UserTypeUpdate>;
