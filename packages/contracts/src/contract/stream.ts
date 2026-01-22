import z from "zod";

import { base } from "./base";

export const streamContract = base.prefix("/api").router({
  getStreamUrls: base
    .route({
      path: "/getStreamUrls/{streamUrlId}",
      method: "GET",
    })
    .input(
      z.object({
        streamUrlId: z.string(),
      })
    )
    .output(
      z
        .object({
          urls: z.array(z.string()),
          error: z.string().optional().default(""),
        })
        .partial()
        .loose()
    ),
});
