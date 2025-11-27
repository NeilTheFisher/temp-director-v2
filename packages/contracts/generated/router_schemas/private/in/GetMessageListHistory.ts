import { z } from "zod";

export const GetMessageListHistory = z.object({
  eventId: z.string().describe("Event Id"),
});
export type GetMessageListHistory = z.infer<typeof GetMessageListHistory>;
