import { z } from "zod";

export const StartRecording = z
  .any()
  .describe("Event when presentor is ready start recording the event");
export type StartRecording = z.infer<typeof StartRecording>;
