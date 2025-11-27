import { z } from "zod";

export const DeviceRequest = z.object({
  userId: z.string(),
  deviceId: z.string(),
  featured: z.boolean().default(false),
});
export type DeviceRequest = z.infer<typeof DeviceRequest>;
