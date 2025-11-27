import { z } from "zod";

export const Subscribed = z
  .object({
    eventId: z.string().describe("Event Id to which user is subscribed"),
    action: z
      .literal("ConnectedUsers")
      .describe("Action to which user is subscribed"),
    subscribe: z
      .boolean()
      .describe("True to subscribe, and false to unsubscribe"),
  })
  .describe("Event when user subscribed to a specific action");
export type Subscribed = z.infer<typeof Subscribed>;
