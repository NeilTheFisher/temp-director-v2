import { z } from "zod";

export const StreamStarted = z
  .object({
    streamId: z.string().describe("Id of the stream to start"),
    code: z
      .string()
      .describe("code of the camera that has the stream")
      .default(""),
  })
  .describe(
    "Callback to the event when user wants to start stream in ricoh camera",
  );
export type StreamStarted = z.infer<typeof StreamStarted>;
