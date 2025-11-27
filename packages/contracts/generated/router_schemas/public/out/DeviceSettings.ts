import { z } from "zod";

export const DeviceSettings = z
  .object({
    sip: z.string().describe("Device Sip"),
    settings: z.record(z.string(), z.any()).describe("Device Settings"),
  })
  .describe("Event sent to front row for device settings");
export type DeviceSettings = z.infer<typeof DeviceSettings>;
