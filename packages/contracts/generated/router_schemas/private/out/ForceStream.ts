import { z } from "zod";

export const ForceStream = z
  .object({ streamId: z.string().describe("stream is available") })
  .describe("Event when moderator forces user to watch a stream");
export type ForceStream = z.infer<typeof ForceStream>;
