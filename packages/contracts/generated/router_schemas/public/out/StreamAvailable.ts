import { z } from "zod";

export const StreamAvailable = z
  .object({ streamId: z.string().describe("stream is available") })
  .describe("Event when moderator sais the stream is available");
export type StreamAvailable = z.infer<typeof StreamAvailable>;
