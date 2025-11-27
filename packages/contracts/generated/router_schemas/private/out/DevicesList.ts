import { z } from "zod";

export const DevicesList = z
  .object({ list: z.array(z.any()).describe("List of devices") })
  .describe("Event sent to share the list of all devices");
export type DevicesList = z.infer<typeof DevicesList>;
