import { z } from "zod";

export const ShowSlideshow = z
  .object({
    value: z.boolean().describe("to show the slideshow or not"),
    wallId: z.string().describe("wall it to which applies"),
  })
  .describe("Event when slideshow should be shown or not");
export type ShowSlideshow = z.infer<typeof ShowSlideshow>;
