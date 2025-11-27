import { z } from "zod";

export const GetCameraUrl = z
  .any()
  .describe("Event sent when ricoh wants to get publishing endpoint");
export type GetCameraUrl = z.infer<typeof GetCameraUrl>;
