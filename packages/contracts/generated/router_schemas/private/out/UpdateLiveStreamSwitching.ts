import { z } from "zod";

export const UpdateLiveStreamSwitching = z
  .object({
    value: z.boolean().describe("If live stream switching is active or not"),
  })
  .describe("Event when moderator turns on/off live stream switching");
export type UpdateLiveStreamSwitching = z.infer<typeof UpdateLiveStreamSwitching>;
