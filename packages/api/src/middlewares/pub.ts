import { implement } from "@orpc/server";
import type { Context } from "../context";
import { appContract } from "../contract";

export const pub = implement(appContract).$context<Context>();
