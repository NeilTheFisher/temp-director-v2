import { z } from "zod";

export const EventUpdate = z
  .object({
    time_limited_invitations: z
      .string()
      .describe("If time_limited_invitations r on/off")
      .optional(),
  })
  .describe("Event sent to update event attributes");
export type EventUpdate = z.infer<typeof EventUpdate>;
