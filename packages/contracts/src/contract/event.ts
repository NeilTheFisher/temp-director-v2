import { eventSchema } from "@director_v2/db/prisma/generated/zod/schemas/models/event.schema";
import { eventIterator } from "@orpc/contract";
import z from "zod";
import { base } from "./base";

export const eventContract = {
  listEvents: base.input(z.void()).output(eventSchema),
  listEventsLive: base.input(z.void()).output(eventIterator(eventSchema)),
  listPartialEvents: base.input(z.void()).output(eventSchema),
};
