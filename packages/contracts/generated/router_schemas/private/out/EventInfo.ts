import { z } from "zod";

export const EventInfo = z
  .any()
  .describe("Event configuration from the director")
  .describe("Event sent to share the current event info");
export type EventInfo = z.infer<typeof EventInfo>;
