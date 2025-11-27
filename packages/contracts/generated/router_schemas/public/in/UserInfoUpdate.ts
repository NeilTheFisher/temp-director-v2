import { z } from "zod";

export const UserInfoUpdate = z.object({
  id: z.string().optional(),
  sip: z.string(),
  name: z.string(),
  avatar: z.string().optional(),
  country: z.string().optional(),
  deviceOs: z.string().optional(),
  deviceModel: z.string().optional(),
  type: z.string().optional(),
  role: z.enum(["user", "guest"]).describe("User Role").optional(),
});
export type UserInfoUpdate = z.infer<typeof UserInfoUpdate>;
