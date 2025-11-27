import { z } from "zod";

export const Statistics = z
  .object({
    moderatorsConnected: z
      .number()
      .int()
      .gte(0)
      .describe("Number of connected moderators"),
    usersConnected: z
      .number()
      .int()
      .gte(0)
      .describe("Number of connected users (Idle + Active + Blocked)"),
    usersActive: z
      .number()
      .int()
      .gte(0)
      .describe("Number of connected active users"),
    usersBlocked: z
      .number()
      .int()
      .gte(0)
      .describe("Number of connected blocked users"),
    messagesLive: z.number().int().gte(0).describe("Number of Live messages"),
    messagesDeleted: z
      .number()
      .int()
      .gte(0)
      .describe("Number of Deleted messages"),
    devicesLiveConnected: z
      .number()
      .int()
      .gte(0)
      .describe("Number of linked users to the Live row devices"),
    devicesStandbyConnected: z
      .number()
      .int()
      .gte(0)
      .describe("Number of linked users to the Live row devices"),
    devicesFrontConnected: z
      .number()
      .int()
      .gte(0)
      .describe("Number of linked users to the Front devices"),
  })
  .describe("Event with the latest statistics");
export type Statistics = z.infer<typeof Statistics>;
