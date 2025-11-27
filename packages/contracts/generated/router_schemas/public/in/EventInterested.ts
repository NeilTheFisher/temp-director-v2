import { z } from "zod";

export const EventInterested = z.object({
  eventId: z.string().describe("Event Id"),
  sip: z
    .string()
    .describe("User that is interested before connecting to the event"),
  name: z.string().describe("Name of the user interested").optional(),
  avatar: z
    .string()
    .describe("Url of the image/avatar of the interested user")
    .optional(),
});
export type EventInterested = z.infer<typeof EventInterested>;
