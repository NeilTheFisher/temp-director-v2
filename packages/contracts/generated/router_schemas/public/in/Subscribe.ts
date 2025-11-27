import { z } from "zod";

export const Subscribe = z
  .object({
    eventId: z.string().describe("Event Id to which user is subscribed"),
    action: z
      .literal("ConnectedUsers")
      .describe("Action to which user is subscribed"),
    subscribe: z
      .boolean()
      .describe("True to subscribe, and false to unsubscribe"),
  })
  .describe("Event when user subscribes to a specific action");
export type Subscribe = z.infer<typeof Subscribe>;
