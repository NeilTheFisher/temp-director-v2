import { z } from "zod";

export const GetEventInfo = z.object({
  eventId: z.string().describe("Event Id"),
});
export type GetEventInfo = z.infer<typeof GetEventInfo>;
