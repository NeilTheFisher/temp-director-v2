import { pub } from "../orpc";

export const healthRouter = pub.health.router({
  ok: pub.health.ok.handler(() => {
    console.log("HealthController.health:");
    return "OK" as const;
  }),
  liveOk: pub.health.liveOk.handler(async function* ({
    input: { max_outputs },
    signal,
  }) {
    console.log("HealthController.liveOk:");

    let count = 0;
    while (
      !signal?.aborted &&
      (max_outputs === undefined || count < max_outputs)
    ) {
      yield "LIVE_OK" as const;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      count++;
    }
  }),
});
