import { z } from "zod";

export const GetMessagesList = z.object({
  eventId: z.string().describe("Event Id"),
});
export type GetMessagesList = z.infer<typeof GetMessagesList>;
