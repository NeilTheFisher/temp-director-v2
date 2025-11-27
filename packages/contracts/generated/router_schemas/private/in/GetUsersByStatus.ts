import { z } from "zod";

export const GetUsersByStatus = z.object({
  status: z.string().describe("Status of the user"),
});
export type GetUsersByStatus = z.infer<typeof GetUsersByStatus>;
