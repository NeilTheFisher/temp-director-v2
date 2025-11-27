import { z } from "zod";

export const UserPublic = z
  .object({
    id: z.string().describe("User Id").optional(),
    role: z.enum(["user", "guest"]).describe("User Role").optional(),
    platform: z.string().describe("User platform").optional(),
    name: z.string().describe("User Name"),
    avatar: z.string().describe("User's Avatar"),
    type: z.string().describe("User's type").optional(),
    sip: z.string().describe("User's SIP number"),
  })
  .describe("User");
export type UserPublic = z.infer<typeof UserPublic>;
