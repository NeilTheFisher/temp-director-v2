import { z } from "zod";

export const DeviceMicrophone = z
  .object({
    userId: z.string().describe("user who changed the state of their device microphone"),
    content: z.boolean().describe("state of device microphone"),
  })
  .describe("Event when user mutes or unmutes their device microphone");
export type DeviceMicrophone = z.infer<typeof DeviceMicrophone>;
