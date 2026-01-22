import { z } from "zod";

export const EventEnd = z.any().describe("Event when presentor is ready to end");
export type EventEnd = z.infer<typeof EventEnd>;
