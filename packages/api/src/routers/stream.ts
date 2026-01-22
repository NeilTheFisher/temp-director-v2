import { ORPCError } from "@orpc/server";

import * as streamRepository from "../lib/repositories/stream";
import { authed } from "../orpc";

export const streamRouter = {
  getStreamUrls: authed.stream.getStreamUrls.handler(async ({ input, context }) => {
    console.log("StreamController.getStreamUrls:");

    if (!context.session?.user) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "No Authorization",
      });
    }

    const userId = Number(context.session.user.id);
    console.log("User ID:", userId);

    // Get client IP from context
    const clientIp = context.clientIp || "";

    const streamInfo = await streamRepository.getStreamUrls(
      Number.parseInt(input.streamUrlId, 10),
      userId,
      clientIp
    );

    if (streamInfo.error) {
      throw new ORPCError("NOT_FOUND", {
        message: `Urls not found: ${streamInfo.error}`,
      });
    }

    return streamInfo;
  }),
};
