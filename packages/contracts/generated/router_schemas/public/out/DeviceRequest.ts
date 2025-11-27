import { z } from "zod";

export const DeviceRequest = z
  .object({
    id: z.string().describe("Device Id"),
    type: z.enum(["front", "live", "on-standby"]).describe("Device Type"),
    name: z.string().describe("Device Name"),
    cancel: z
      .boolean()
      .describe(
        "If true this is a cancel stream request, else it is to start a stream",
      ),
    featured: z.boolean().describe("If user is featured or not").default(false),
  })
  .describe("Event sent to a user to connect it to a device");
export type DeviceRequest = z.infer<typeof DeviceRequest>;
