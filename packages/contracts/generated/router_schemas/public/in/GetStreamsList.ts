import { z } from "zod";

export const GetStreamsList = z.object({
  eventId: z.string().describe("Event Id"),
});
export type GetStreamsList = z.infer<typeof GetStreamsList>;
