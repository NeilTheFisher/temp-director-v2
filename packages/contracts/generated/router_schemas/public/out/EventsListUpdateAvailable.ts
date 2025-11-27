import { z } from "zod";

export const EventsListUpdateAvailable = z
  .object({ eventId: z.string().describe("Event id").optional() })
  .describe("Event sent when there is an updated events list");
export type EventsListUpdateAvailable = z.infer<
  typeof EventsListUpdateAvailable
>;
