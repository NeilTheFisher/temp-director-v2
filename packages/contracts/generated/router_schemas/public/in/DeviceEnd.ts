import { z } from "zod";

export const DeviceEnd = z.object({
  deviceId: z.string().describe("Device Id"),
});
export type DeviceEnd = z.infer<typeof DeviceEnd>;
