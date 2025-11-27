import { z } from "zod";

export const ShowMiniCarousel = z
  .object({
    value: z.boolean().describe("to show the carousel or not"),
    orientation: z.string().describe("orientation of the carousel").optional(),
  })
  .describe("Event when carousel should be shown or not");
export type ShowMiniCarousel = z.infer<typeof ShowMiniCarousel>;
