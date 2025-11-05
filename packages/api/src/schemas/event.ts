import { z } from "zod";

export const EventSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  status: z.string(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export const EventListInputSchema = z.object({});

export const EventListOutputSchema = z.array(EventSchema);
