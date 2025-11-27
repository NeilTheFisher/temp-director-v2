import { z } from "zod";

export const EventEnded = z.object({
  eventId: z.string().describe("Event id").optional(),
});
export type EventEnded = z.infer<typeof EventEnded>;
