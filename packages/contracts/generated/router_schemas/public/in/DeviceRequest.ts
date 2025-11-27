import { z } from "zod";

export const DeviceRequest = z.object({ deviceId: z.string() });
export type DeviceRequest = z.infer<typeof DeviceRequest>;
