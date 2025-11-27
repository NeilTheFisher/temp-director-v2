import { z } from "zod";

export const UserStatusUpdate = z
  .any()
  .describe("User")
  .describe("Event sent when a user have his status updated");
export type UserStatusUpdate = z.infer<typeof UserStatusUpdate>;
