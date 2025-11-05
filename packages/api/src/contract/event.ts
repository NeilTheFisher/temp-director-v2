import { oc } from "@orpc/contract";
import { EventListInputSchema, EventListOutputSchema } from "../schemas/event";

export const eventContract = {
  listEvents: oc.input(EventListInputSchema).output(EventListOutputSchema),
  listPartialEvents: oc
    .input(EventListInputSchema)
    .output(EventListOutputSchema),
};
