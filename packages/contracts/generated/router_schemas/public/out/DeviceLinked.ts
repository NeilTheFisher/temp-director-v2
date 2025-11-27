import { z } from "zod";

export const DeviceLinked = z
  .object({
    deviceId: z.string().describe("Device ID to which the SIP belongs"),
    deviceSip: z.string().describe("SIP to connect the user to"),
  })
  .describe(
    "Event sent to when the User is successfully linked to a device SIP",
  );
export type DeviceLinked = z.infer<typeof DeviceLinked>;
