import { z } from "zod";

export const UsersJoined = z
  .object({
    list: z.array(
      z.record(z.string(), z.any()).and(
        z
          .object({
            id: z.string().describe("User Id").optional(),
            role: z.enum(["user", "guest"]).describe("User Role").optional(),
            platform: z.string().describe("User platform").optional(),
            name: z.string().describe("User Name"),
            avatar: z.string().describe("User's Avatar"),
            type: z.string().describe("User's type").optional(),
            sip: z.string().describe("User's SIP number"),
          })
          .describe("User"),
      ),
    ),
  })
  .describe("Event sent to share the list of all users");
export type UsersJoined = z.infer<typeof UsersJoined>;
