import { z } from "zod";

export const DeviceRequestSettings = z.object({ sip: z.string() });
export type DeviceRequestSettings = z.infer<typeof DeviceRequestSettings>;
