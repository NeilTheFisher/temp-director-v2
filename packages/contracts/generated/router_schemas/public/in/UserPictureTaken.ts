import { z } from "zod";

export const UserPictureTaken = z
  .object({
    camera_x: z.number(),
    camera_y: z.number(),
    camera_zoom: z.number(),
  })
  .describe("Event when user takes a picture");
export type UserPictureTaken = z.infer<typeof UserPictureTaken>;
