import { z } from "zod";

export const EventDeleted = z
  .object({ eventId: z.string().describe("event id") })
  .describe("Emitted Event when event gets deleted");
export type EventDeleted = z.infer<typeof EventDeleted>;
