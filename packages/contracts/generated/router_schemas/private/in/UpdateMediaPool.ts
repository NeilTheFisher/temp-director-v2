import { z } from "zod";

export const UpdateMediaPool = z
  .object({
    event: z
      .object({
        value: z.boolean().describe("event media pool on/of"),
        info: z.record(z.string(), z.any()).describe("event media pool info"),
      })
      .describe("If media pool is active or not"),
    videowall: z
      .object({
        value: z.boolean().describe("videowall media pool on/of"),
        info: z
          .record(z.string(), z.any())
          .describe("videowall media pool info"),
      })
      .describe("Videowall Media pool properties"),
    content: z
      .object({
        url: z.string().describe("content url for the media pool"),
        info: z.record(z.string(), z.any()).describe("content info"),
      })
      .describe("The content displayed in media pool"),
  })
  .describe("Event when moderator turns on/off media pool");
export type UpdateMediaPool = z.infer<typeof UpdateMediaPool>;
