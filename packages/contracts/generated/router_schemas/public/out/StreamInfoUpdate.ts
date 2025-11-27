import { z } from "zod";

export const StreamInfoUpdate = z
  .any()
  .describe("Stream")
  .describe("Event sent when a stream has been updated");
export type StreamInfoUpdate = z.infer<typeof StreamInfoUpdate>;
