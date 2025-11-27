import { z } from "zod";

export const DeviceUnlink = z.object({
  userId: z.string().describe("User to unlink").optional(),
  deviceId: z.string().describe("Device to unlink").optional(),
  deviceType: z.string().describe("Device type to unlink").optional(),
});
export type DeviceUnlink = z.infer<typeof DeviceUnlink>;
