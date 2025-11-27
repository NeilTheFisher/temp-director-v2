import { z } from "zod";

export const UserSimple = z
  .object({
    id: z.string().describe("User Id").optional(),
    role: z.enum(["user", "guest"]).describe("User Role").optional(),
    name: z.string().describe("User Name"),
    avatar: z.string().describe("User's Avatar"),
    sip: z.string().describe("User's SIP number"),
    ip: z.string().describe("User's IP").optional(),
    location: z.string().describe("User's location").optional(),
    agent: z.string().describe("User's User-Agent").optional(),
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
      .describe("User's status")
      .optional(),
    is_muted: z.boolean().describe("if the user is muted").optional(),
    is_featured: z.boolean().describe("if the user is featured").optional(),
    poorConnection: z
      .boolean()
      .describe("if the user has poor connection")
      .optional(),
    type: z.string().describe("User's type").optional(),
    deviceId: z
      .union([
        z.string().describe("Device Id linked to this user"),
        z.null().describe("Device Id linked to this user"),
      ])
      .describe("Device Id linked to this user")
      .optional(),
    deviceType: z
      .union([
        z.string().describe("Device type linked to this user"),
        z.null().describe("Device type linked to this user"),
      ])
      .describe("Device type linked to this user")
      .optional(),
    deviceActiveTimestamp: z
      .number()
      .int()
      .gte(0)
      .describe("Device active timestamp")
      .optional(),
    deviceLinkedTimestamp: z
      .number()
      .int()
      .gte(0)
      .describe("Device linked timestamp")
      .optional(),
    blockingTimestamp: z
      .number()
      .int()
      .gte(0)
      .describe("Device blocked timestamp")
      .optional(),
    flagsCounterMessage: z
      .number()
      .int()
      .gte(0)
      .describe("Counter for flagged messages")
      .optional(),
    flagsCounterVideo: z
      .number()
      .int()
      .gte(0)
      .describe("Counter for flagged videos")
      .optional(),
    flagsCounterUser: z
      .number()
      .int()
      .gte(0)
      .describe("Counter for flagged by other users")
      .optional(),
    userJoinedTimestamp: z
      .number()
      .int()
      .gte(0)
      .describe("User joined timestamp")
      .optional(),
    userDisconnectedTimestamp: z
      .number()
      .int()
      .gte(0)
      .describe("User disconnected timestamp")
      .optional(),
    lastPreviewTimestamp: z
      .number()
      .int()
      .gte(0)
      .describe("User lastPreview timestamp")
      .optional(),
    lastMessageSentTimestamp: z
      .number()
      .int()
      .gte(0)
      .describe("Last message that user has sent timestamp")
      .optional(),
    os_name: z.string().describe("OS name").optional(),
    os_version: z.string().describe("OS version").optional(),
    device_model: z.string().describe("Device model").optional(),
  })
  .describe("User");
export type UserSimple = z.infer<typeof UserSimple>;
