import { oc } from "@orpc/contract";
import { HealthCheckOutputSchema } from "../schemas/health";

export const healthContract = oc.output(HealthCheckOutputSchema);
