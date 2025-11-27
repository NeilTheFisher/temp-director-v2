import { z } from "zod";

export const StreamInfoUpdate = z.object({
  streamId: z.string(),
  userIds: z.array(z.string()),
});
export type StreamInfoUpdate = z.infer<typeof StreamInfoUpdate>;
