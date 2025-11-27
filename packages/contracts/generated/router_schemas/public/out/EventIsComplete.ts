import { z } from "zod";

export const EventIsComplete = z
  .any()
  .describe("Event sent when event is complete");
export type EventIsComplete = z.infer<typeof EventIsComplete>;
