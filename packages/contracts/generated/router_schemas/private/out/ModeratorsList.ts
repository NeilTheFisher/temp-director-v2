import { z } from "zod";

export const ModeratorsList = z
  .object({
    list: z.array(
      z.record(z.string(), z.any()).and(
        z
          .object({
            id: z.string().describe("Moderator Id"),
            name: z.string().describe("Moderator name"),
            role: z.literal("moderator").describe("Moderator Role"),
            avatar: z.string().describe("Moderator avatar"),
          })
          .describe("Moderator"),
      ),
    ),
  })
  .describe("Event sent to share the list of all moderators");
export type ModeratorsList = z.infer<typeof ModeratorsList>;
