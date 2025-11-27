import { z } from "zod";

export const SipStatusUpdated = z
  .object({
    deviceId: z.string().describe("id of the device"),
    sip: z.string().describe("sip thats is being updated"),
    status: z.string().describe("status of the sip"),
    message: z.string().describe("status message or error"),
    date: z.number().int().describe("date when sip was updated"),
  })
  .describe("Event when wall updated sip status");
export type SipStatusUpdated = z.infer<typeof SipStatusUpdated>;
