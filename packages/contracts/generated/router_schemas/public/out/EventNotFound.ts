import { z } from "zod";

export const EventNotFound = z
  .any()
  .describe(
    "Event sent back when the event does not exist in the list of published events",
  );
export type EventNotFound = z.infer<typeof EventNotFound>;
