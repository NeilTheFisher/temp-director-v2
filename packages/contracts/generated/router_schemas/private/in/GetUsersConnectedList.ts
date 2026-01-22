import { z } from "zod";

export const GetUsersConnectedList = z.object({
  eventId: z.string().describe("Event Id"),
  limit: z
    .union([
      z.number().int().describe("Number of users requested"),
      z.null().describe("Number of users requested"),
    ])
    .describe("Number of users requested")
    .optional(),
  indexStart: z.number().int().describe("index from which user list starts").optional(),
  indexEnd: z
    .union([
      z.number().int().describe("index from where user list ends"),
      z.null().describe("index from where user list ends"),
    ])
    .describe("index from where user list ends")
    .optional(),
  search: z
    .union([z.string().describe("user search term"), z.null().describe("user search term")])
    .describe("user search term")
    .optional(),
  mostActiveUsers: z.boolean().describe("show most active users").optional(),
});
export type GetUsersConnectedList = z.infer<typeof GetUsersConnectedList>;
