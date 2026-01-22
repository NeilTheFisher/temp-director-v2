import type { Context } from "../context";
import { appContract } from "@director_v2/contracts";
import { implement } from "@orpc/server";

export const base = implement(appContract).$context<Context>();
