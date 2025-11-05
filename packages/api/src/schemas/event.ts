import { eventSchema } from "@director_v2/db";
import { z } from "zod";

// Reuse generated eventSchema from database models
export const EventSchema = eventSchema;

export const EventListInputSchema = z.object({});

export const EventListOutputSchema = z.array(EventSchema);
