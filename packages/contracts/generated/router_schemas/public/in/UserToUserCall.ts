import { z } from "zod";

export const UserToUserCall = z
  .object({
    type: z.enum(["audio", "video"]).describe("User to user call type"),
    duration: z
      .number()
      .int()
      .describe("User to user call duration in seconds")
      .default(0),
    date: z.number().int().describe("User to user call date in seconds"),
    calleeId: z.string().describe("User who received the call"),
    direction: z
      .enum(["inbound", "outbound"])
      .describe("iI a call is incoming or outgoing")
      .default("inbound"),
  })
  .describe("Event when user takes a picture");
export type UserToUserCall = z.infer<typeof UserToUserCall>;
