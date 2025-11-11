import z from "zod";
import { base } from "./base";

export const healthContract = base.output(z.literal("OK"));
