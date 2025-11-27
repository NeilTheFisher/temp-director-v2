import { z } from "zod";

export const DeviceSelfRegistered = z.object({
  id: z.string().describe("Device id").optional(),
  name: z.string().describe("Device Name").optional(),
  type: z.string().describe("Device Type").optional(),
  active: z.boolean().describe("Is Active").optional(),
  code: z.string().describe("Unique device id").optional(),
  error: z.string().describe("Error from device register").optional(),
  deviceUpdateUrl: z
    .string()
    .describe("Api endpoint to update camera")
    .optional(),
  bitrate: z.number().int().describe("Streams's url bitrate").optional(),
  user: z.any().optional(),
  stream: z.any().optional(),
});
export type DeviceSelfRegistered = z.infer<typeof DeviceSelfRegistered>;
