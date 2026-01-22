import { z } from "zod";

export const DisconnectAll = z.any().describe("Event when presentor wants to disconnect all users");
export type DisconnectAll = z.infer<typeof DisconnectAll>;
