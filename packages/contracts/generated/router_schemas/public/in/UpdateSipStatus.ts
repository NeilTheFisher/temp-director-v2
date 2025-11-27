import { z } from "zod";

export const UpdateSipStatus = z
  .object({
    deviceId: z.string().describe("id of the device"),
    sip: z.string().describe("sip thats is being updated"),
    status: z.string().describe("status of the sip"),
    message: z.string().describe("status message or error").optional(),
  })
  .describe("Event when wall is updating registration status of the sip");
export type UpdateSipStatus = z.infer<typeof UpdateSipStatus>;
