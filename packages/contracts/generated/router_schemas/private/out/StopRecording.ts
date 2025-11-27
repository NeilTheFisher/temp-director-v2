import { z } from "zod";

export const StopRecording = z
  .any()
  .describe("Event when presentor is ready stop recording the event");
export type StopRecording = z.infer<typeof StopRecording>;
