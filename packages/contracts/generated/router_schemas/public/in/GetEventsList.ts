import { z } from "zod";

export const GetEventsList = z
  .object({ eventIds: z.array(z.string()).describe("Event Ids").optional() })
  .describe("Event sent when a user wants to get events list");
export type GetEventsList = z.infer<typeof GetEventsList>;
