import { ORPCError } from "@orpc/server";
import { authed } from "../orpc";

// TODO: Import your actual services when they're available
// import { StreamUrlService } from "../services/StreamUrlService";

// const streamUrlService = new StreamUrlService();

export const streamRouter = {
  getStreamUrls: authed.stream.getStreamUrls.handler(
    async ({ input, context }) => {
      console.log("StreamController.getStreamUrls:");

      if (!context.session?.user) {
        throw new ORPCError("UNAUTHORIZED", {
          message: "No Authorization",
        });
      }

      const userId = context.session.user.id;
      console.log("User ID:", userId);

      // TODO: Get client IP from context/headers
      // In Next.js, you might need to pass this from the client or get it from headers
      // const clientIp = ""; // Placeholder

      // TODO: Replace with actual service calls
      // const streamInfo = await streamUrlService.getStreamUrls(
      //   (input as Record<string, number>).streamUrlId,
      //   parseInt(userId),
      //   clientIp
      // );
      //
      // if (!streamInfo) {
      //   throw new ORPCError("NOT_FOUND", {
      //     message: "Urls not found or not authenticated"
      //   });
      // }
      //
      // return streamInfo;

      // Temporary placeholder
      console.log(
        "Stream URL ID:",
        (input as Record<string, number>).streamUrlId
      );
      return {
        urls: [
          "https://example.com/stream1.m3u8",
          "https://example.com/stream2.m3u8",
        ],
      };
    }
  ),
};
