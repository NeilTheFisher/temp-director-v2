import { z } from "zod";

export const UsersCountChanged = z
  .object({
    count: z.number().int().describe("The total count of connected users"),
    userCount: z.number().int().describe("The total type users").optional(),
    guestCount: z.number().int().describe("The total type guest").optional(),
  })
  .describe(
    "Event sent when a user leaves or join, telling the users how many users are currently connected",
  );
export type UsersCountChanged = z.infer<typeof UsersCountChanged>;
