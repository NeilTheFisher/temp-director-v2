import { appContract } from "@director_v2/contracts";
import { implement } from "@orpc/server";
import type { Context } from "../context";

export const base = implement(appContract).$context<Context>();
