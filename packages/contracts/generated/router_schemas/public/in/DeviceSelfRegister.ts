import { z } from "zod";

export const DeviceSelfRegister = z.object({
  id: z.string().describe("Device Id").optional(),
  name: z.string().describe("Device Name").optional(),
  type: z.string().describe("Device Type").optional(),
  active: z.boolean().describe("Is Active").optional(),
  force: z.boolean().describe("To forcefully overwrite the device").optional(),
});
export type DeviceSelfRegister = z.infer<typeof DeviceSelfRegister>;
