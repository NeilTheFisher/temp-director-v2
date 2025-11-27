import { z } from "zod";

export const DeviceMicrophone = z
  .object({ content: z.boolean().describe("state of device microphone") })
  .describe("Event when user mutes or unmutes their device microphone");
export type DeviceMicrophone = z.infer<typeof DeviceMicrophone>;
