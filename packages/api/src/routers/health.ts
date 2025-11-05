import { pub } from "../orpc";

export const healthRouter = pub.health.handler(() => {
  console.log("HealthController.health:");
  return "OK";
});
