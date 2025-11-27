import { z } from "zod";

export const DeviceResponse = z.object({ content: z.boolean() });
export type DeviceResponse = z.infer<typeof DeviceResponse>;
