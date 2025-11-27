import { z } from "zod";

export const EventOpened = z.object({
  eventId: z.string().describe("Event Id"),
});
export type EventOpened = z.infer<typeof EventOpened>;
