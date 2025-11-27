import { z } from "zod";

export const ShowFeaturedCaller = z
  .object({
    id: z.string().describe("User id"),
    sip: z
      .string()
      .describe(
        "The user's phone number with which it called of will call the video wall.",
      ),
    name: z.string().describe("The user's name."),
    avatar: z.string().describe("User's Avatar"),
    priority: z.number().describe("User's priority on the wall"),
    deviceId: z.string().describe("User's deviceId"),
  })
  .describe("Event when moderator features user on Wall");
export type ShowFeaturedCaller = z.infer<typeof ShowFeaturedCaller>;
