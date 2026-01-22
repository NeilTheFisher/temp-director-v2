import { z } from "zod";

export const User = z
  .object({
    id: z.string().describe("User Id"),
    role: z.enum(["user", "guest"]).describe("User Role"),
    name: z.string().describe("User Name"),
    avatar: z.string().describe("User's Avatar"),
    sip: z.string().describe("User's SIP number"),
    ip: z.string().describe("User's IP"),
    location: z.string().describe("User's location"),
    agent: z.string().describe("User's User-Agent"),
    nodeName: z.string().describe("User's node name").optional(),
    status: z
      .enum([
        "blocked",
        "stream-active",
        "stream-declined",
        "stream-requested",
        "idle",
        "on-call",
        "unknown",
        "disconnected",
        "removed",
      ])
      .describe("User's status"),
    is_muted: z.boolean().describe("if the user is muted"),
    is_featured: z.boolean().describe("if the user is featured").optional(),
    poorConnection: z.boolean().describe("if the user has poor connection"),
    platform: z.string().describe("Users platform").optional(),
    type: z.string().describe("User's type"),
    deviceId: z
      .union([
        z.string().describe("Device Id linked to this user"),
        z.null().describe("Device Id linked to this user"),
      ])
      .describe("Device Id linked to this user"),
    deviceType: z
      .union([
        z.string().describe("Device type linked to this user"),
        z.null().describe("Device type linked to this user"),
      ])
      .describe("Device type linked to this user")
      .optional(),
    deviceActiveTimestamp: z.number().int().gte(0).describe("Device active timestamp"),
    deviceLinkedTimestamp: z.number().int().gte(0).describe("Device linked timestamp"),
    blockingTimestamp: z.number().int().gte(0).describe("Device blocked timestamp"),
    flagsCounterMessage: z
      .number()
      .int()
      .gte(0)
      .describe("Counter for flagged messages")
      .optional(),
    flagsCounterVideo: z.number().int().gte(0).describe("Counter for flagged videos").optional(),
    flagsCounterUser: z
      .number()
      .int()
      .gte(0)
      .describe("Counter for flagged by other users")
      .optional(),
    userJoinedTimestamp: z.number().int().gte(0).describe("User joined timestamp"),
    userDisconnectedTimestamp: z.number().int().gte(0).describe("User disconnected timestamp"),
    lastPreviewTimestamp: z.number().int().gte(0).describe("User lastPreview timestamp"),
    lastMessageSentTimestamp: z
      .number()
      .int()
      .gte(0)
      .describe("Last message that user has sent timestamp"),
    os_name: z.string().describe("OS name"),
    os_version: z.string().describe("OS version"),
    device_model: z.string().describe("Device model"),
    volume: z.record(z.string(), z.any()).describe("User's volume").optional(),
  })
  .describe("User");
export type User = z.infer<typeof User>;
