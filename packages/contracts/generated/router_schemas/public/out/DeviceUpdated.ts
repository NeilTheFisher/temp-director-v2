import { z } from "zod";

export const DeviceUpdated = z.object({
  id: z.string().describe("Device Id"),
  name: z.string().describe("Device Name").optional(),
  type: z
    .enum(["front", "live", "on-standby"])
    .describe("Device Type")
    .optional(),
  status: z.enum(["available", "busy"]).describe("Device Status").optional(),
  sips_registration_status: z
    .record(z.string(), z.any())
    .describe("Device Sips registration status")
    .optional(),
  order: z.number().describe("The order of the stream").optional(),
  features: z
    .object({
      slideshow: z
        .boolean()
        .describe("slideshow supported mode on/off")
        .default(false),
      messageStream: z
        .boolean()
        .describe("message board supported mode on/off")
        .default(true),
    })
    .describe("features params")
    .optional(),
  settings: z
    .record(z.string(), z.any())
    .describe("Device Settings")
    .optional(),
});
export type DeviceUpdated = z.infer<typeof DeviceUpdated>;
