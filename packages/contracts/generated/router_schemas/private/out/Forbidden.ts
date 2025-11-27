import { z } from "zod";

export const Forbidden = z
  .object({
    event: z.string().describe("Event received and refused"),
    input: z.any().describe("Invalid data sent with the event "),
    error: z.any().describe("Validation error"),
  })
  .describe("Event sent back when an event is refused due invalid input data.");
export type Forbidden = z.infer<typeof Forbidden>;
