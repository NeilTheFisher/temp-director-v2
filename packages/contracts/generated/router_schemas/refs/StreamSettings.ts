import { z } from "zod";

export const StreamSettings = z
  .object({
    selected_stream_id: z.string().describe("selected stream id"),
    live_stream_switching: z
      .boolean()
      .describe("if live switching mode is on/off"),
    picture_in_picture_mode: z.boolean().describe("If the pip is on/off"),
    picture_in_picture_params: z
      .object({
        streamId: z.string().describe("Stream Id"),
        position: z.string().describe("Stream position"),
      })
      .describe("Picture in picture parameters"),
    silent_mode: z.boolean().describe("If the silent_mode is on/off"),
    media_pool: z.any().describe("media pool settings"),
    standby_media: z.any().describe("standby media settings"),
  })
  .describe("Stream settings for control room");
export type StreamSettings = z.infer<typeof StreamSettings>;
