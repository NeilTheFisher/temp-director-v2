import { z } from "zod";

export const StreamStart = z
  .object({
    streamId: z.string().describe("Id of the stream to start"),
    code: z
      .string()
      .describe("code of the camera that has the stream")
      .default(""),
  })
  .describe("Event user wants to start stream in ricoh camera");
export type StreamStart = z.infer<typeof StreamStart>;
