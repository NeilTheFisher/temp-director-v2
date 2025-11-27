import { z } from "zod";

export const ShowFrontRowUser = z
  .object({
    id: z.string().describe("User id"),
    name: z.string().describe("The user's name."),
    avatar: z.string().describe("User's Avatar"),
  })
  .describe("Event sent when a user gets put on front row");
export type ShowFrontRowUser = z.infer<typeof ShowFrontRowUser>;
