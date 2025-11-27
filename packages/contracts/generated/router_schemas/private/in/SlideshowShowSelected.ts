import { z } from "zod";

export const SlideshowShowSelected = z
  .object({
    list: z.array(z.any()).describe("to show the slideshow or not"),
    wallId: z.string().describe("wall it to which applies"),
  })
  .describe("Event when slideshow should be shown or not");
export type SlideshowShowSelected = z.infer<typeof SlideshowShowSelected>;
