import { z } from "zod";

export const DeviceStart = z.object({
  deviceId: z.string().describe("Device Id"),
});
export type DeviceStart = z.infer<typeof DeviceStart>;
