import { z } from "zod";

export const DeviceConnection = z
  .object({
    userId: z
      .string()
      .describe("user who changed the state of their connection"),
    poorConnection: z
      .boolean()
      .describe("if device has poor connection or not"),
  })
  .describe("Event when user shows good or bad connection");
export type DeviceConnection = z.infer<typeof DeviceConnection>;
