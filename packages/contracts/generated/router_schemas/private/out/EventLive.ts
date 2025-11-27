import { z } from "zod";

export const EventLive = z
  .object({ eventId: z.string().describe("event id") })
  .describe("Emitted Event when event goes from upcoming to live");
export type EventLive = z.infer<typeof EventLive>;
