import { z } from "zod";

export const StreamsList = z
  .object({
    list: z.array(
      z.record(z.string(), z.any()).and(
        z
          .object({
            id: z.string().describe("Stream ID"),
            selected: z.boolean().describe("If the stream was selected").optional(),
            order: z.number().describe("The order of the stream").optional(),
            info: z
              .object({
                name: z.string().describe("Stream Name"),
                code: z.string().describe("Code").optional(),
                selected: z.boolean().describe("If the stream was selected").optional(),
                position: z
                  .string()
                  .describe("If the stream is in pip mode its position")
                  .default(""),
                urls: z
                  .array(
                    z.object({
                      url: z.string().describe("Stream Url"),
                      serverId: z.string().describe("ServerId").optional(),
                      url2: z
                        .union([
                          z.string().describe("Stream Url2"),
                          z.null().describe("Stream Url2"),
                        ])
                        .describe("Stream Url2")
                        .optional(),
                      download_url: z.string().describe("Download Url").optional(),
                      is_running: z.boolean().describe("is stream is running").optional(),
                      publishing_url: z.string().describe("Publishing Url").optional(),
                      resolution: z.string().describe("Stream resolution"),
                      web_urls: z
                        .union([
                          z
                            .object({
                              codeUrl: z.string().describe("code url"),
                              dataUrl: z.string().describe("data url"),
                              frameworkUrl: z.string().describe("framework url"),
                              loaderUrl: z.string().describe("loader url"),
                            })
                            .describe("urls needed for web simulation"),
                          z.null().describe("urls needed for web simulation"),
                        ])
                        .describe("urls needed for web simulation")
                        .optional(),
                    })
                  )
                  .describe("Stream URL"),
                type: z
                  .enum(["standard", "pre-event", "post-event", "in-picture", "floater"])
                  .describe("Stream Name")
                  .optional(),
                video_format: z
                  .enum(["sphere", "hemisphere", "planar"])
                  .describe("Stream video format")
                  .optional(),
                format: z
                  .union([z.string().describe("Stream format"), z.null().describe("Stream format")])
                  .describe("Stream format")
                  .optional(),
                preStream: z
                  .union([
                    z.string().describe("Pre Stream Url if exists"),
                    z.null().describe("Pre Stream Url if exists"),
                  ])
                  .describe("Pre Stream Url if exists")
                  .optional(),
                rotation: z.number().describe("Stream horizontal rotation").optional(),
                vertical_rotation: z.number().describe("Stream vvertical rotation").optional(),
                previewUrl: z
                  .union([
                    z.string().describe("Preview Stream Url if exists"),
                    z.null().describe("Preview Stream Url if exists"),
                  ])
                  .describe("Preview Stream Url if exists")
                  .optional(),
                loop: z
                  .union([
                    z.boolean().describe("Loop stream or play only once"),
                    z.null().describe("Loop stream or play only once"),
                  ])
                  .describe("Loop stream or play only once")
                  .optional(),
                is_equirectangular: z.boolean().describe("Is EquiRectangular").optional(),
                is_stereo: z.boolean().describe("Is Stereo").optional(),
                is_360: z.boolean().describe("Is 360").optional(),
                access_type: z.string().describe("Stream access").optional(),
                saturation_mod: z.number().int().gte(0).describe("Saturation Mod").optional(),
                gamma_mod: z.number().int().gte(0).describe("Gamma Mod").optional(),
                updated_at: z.number().describe("Last updated at timestamp").optional(),
              })
              .describe("Stream Info")
              .optional(),
            users: z.array(z.string()).describe("Stream Assigned Users").optional(),
          })
          .describe("Stream")
      )
    ),
    settings: z.record(z.string(), z.any()).and(
      z
        .object({
          selected_stream_id: z.string().describe("selected stream id"),
          live_stream_switching: z.boolean().describe("if live switching mode is on/off"),
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
        .describe("Stream settings for control room")
    ),
  })
  .describe("Event sent to share the list of all streams");
export type StreamsList = z.infer<typeof StreamsList>;
