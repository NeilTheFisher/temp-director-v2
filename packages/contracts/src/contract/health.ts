import { oc } from "@orpc/contract";
import z from "zod";

export const healthContract = oc.output(z.literal("OK"));
