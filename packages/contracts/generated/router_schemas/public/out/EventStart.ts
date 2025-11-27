import { z } from "zod";

export const EventStart = z
  .any()
  .describe("Event when presentor is ready to start");
export type EventStart = z.infer<typeof EventStart>;
