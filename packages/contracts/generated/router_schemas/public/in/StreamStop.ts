import { z } from "zod";

export const StreamStop = z
  .object({
    streamId: z.string().describe("Id of the stream to start"),
    code: z
      .string()
      .describe("code of the camera that has the stream")
      .default(""),
  })
  .describe("Event when user wants to stop ricoh camera stream");
export type StreamStop = z.infer<typeof StreamStop>;
