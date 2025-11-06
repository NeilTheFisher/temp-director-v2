import { eventSchema } from "@director_v2/db/prisma/generated/zod/schemas/models/event.schema";
import { oc } from "@orpc/contract";
import z from "zod";

export const eventContract = {
  listEvents: oc.input(z.void()).output(eventSchema),
  listPartialEvents: oc.input(z.void()).output(eventSchema),
};
