import { pub } from "../orpc";

export const healthRouter = {
  health: pub.health.handler(() => {
    console.log("HealthController.health:");
    return "OK";
  }),
};
