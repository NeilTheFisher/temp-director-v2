import { z } from "zod";

export const UserDeviceUnlink = z
  .object({
    userId: z.string().describe("user id"),
    deviceId: z.string().describe("device id"),
    deviceType: z.enum(["front", "live", "on-standby"]).describe("Device Type"),
  })
  .describe("Event sent when a user unlinks from the device");
export type UserDeviceUnlink = z.infer<typeof UserDeviceUnlink>;
