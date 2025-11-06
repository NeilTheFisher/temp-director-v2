import { oc } from "@orpc/contract";
import { StreamUrlInputSchema, StreamUrlOutputSchema } from "../schemas/stream";

export const streamContract = {
  getStreamUrls: oc.input(StreamUrlInputSchema).output(StreamUrlOutputSchema),
};
