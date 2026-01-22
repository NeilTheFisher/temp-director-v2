import { z } from "zod";

export const DeviceUnlinkAlert = z.object({
  userId: z.string().describe("User to unlink").optional(),
  timeout: z
    .number()
    .int()
    .gte(0)
    .describe("After how long the user will be disconnected")
    .optional(),
  message: z.string().describe("Message why the user is being unlinked").optional(),
});
export type DeviceUnlinkAlert = z.infer<typeof DeviceUnlinkAlert>;
