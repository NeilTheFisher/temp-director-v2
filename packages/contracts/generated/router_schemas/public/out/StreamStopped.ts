import { z } from "zod";

export const StreamStopped = z
  .object({
    streamId: z.string().describe("Id of the stream to start"),
    code: z
      .string()
      .describe("code of the camera that has the stream")
      .default(""),
  })
  .describe(
    "Callback to the event when user wants to stop ricoh camera stream",
  );
export type StreamStopped = z.infer<typeof StreamStopped>;
