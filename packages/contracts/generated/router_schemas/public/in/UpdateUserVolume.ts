import { z } from "zod";

export const UpdateUserVolume = z.object({
  stream: z.number().describe("Stream volume"),
  call: z.number().describe("Call volume"),
});
export type UpdateUserVolume = z.infer<typeof UpdateUserVolume>;
