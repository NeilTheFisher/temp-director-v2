import { z } from "zod";

export const Moderator = z
  .object({
    id: z.string().describe("Moderator Id"),
    name: z.string().describe("Moderator name"),
    role: z.literal("moderator").describe("Moderator Role"),
    avatar: z.string().describe("Moderator avatar"),
  })
  .describe("Moderator");
export type Moderator = z.infer<typeof Moderator>;
