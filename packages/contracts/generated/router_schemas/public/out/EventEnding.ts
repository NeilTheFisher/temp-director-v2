import { z } from "zod";

export const EventEnding = z.object({
  eventId: z.string().describe("Event id").optional(),
});
export type EventEnding = z.infer<typeof EventEnding>;
