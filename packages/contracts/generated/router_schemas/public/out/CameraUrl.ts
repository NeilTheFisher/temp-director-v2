import { z } from "zod";

export const CameraUrl = z
  .object({
    url: z.string().describe("Camera's url"),
    bitrate: z.number().int().describe("Camera's url bitrate").optional(),
    deviceId: z.string().describe("cameraId associated to the url"),
  })
  .describe("Event sent when ricoh receives the url");
export type CameraUrl = z.infer<typeof CameraUrl>;
