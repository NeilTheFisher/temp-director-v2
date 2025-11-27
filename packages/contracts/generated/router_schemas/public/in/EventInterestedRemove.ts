import { z } from "zod";

export const EventInterestedRemove = z.object({
  eventId: z.string().describe("Event Id"),
  sip: z
    .string()
    .describe("User that is interested before connecting to the event"),
});
export type EventInterestedRemove = z.infer<typeof EventInterestedRemove>;
