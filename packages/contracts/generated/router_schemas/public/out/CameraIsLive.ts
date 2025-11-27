import { z } from "zod";

export const CameraIsLive = z
  .object({
    streamId: z.string().describe("Stream id"),
    code: z.string().describe("Ricoh camera code"),
  })
  .describe("Event when ricoh camera goes live");
export type CameraIsLive = z.infer<typeof CameraIsLive>;
