import { z } from "zod";

export const SlideshowAutoMode = z
  .object({
    slideshow_items_count: z.number().describe("to show the slideshow or not").default(10),
    wallId: z.string().describe("wall it to which applies"),
    galleryId: z.string().describe("gallery id for auto mode"),
    galleryName: z.string().describe("gallery name for auto mode"),
  })
  .describe("Event when slideshow should be switch to auto mode or count updated");
export type SlideshowAutoMode = z.infer<typeof SlideshowAutoMode>;
