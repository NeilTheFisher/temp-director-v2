import { PrismaMariaDb as PrismaMySQL } from "@prisma/adapter-mariadb";
import { redis } from "bun";
import { env } from "../../config";
import { PrismaClient } from "../prisma/generated/client";

const adapter = new PrismaMySQL(env.DATABASE_URL);
const prisma = new PrismaClient({
  adapter,
  log: ["query"],
});

console.log("connecting to redis");
console.time("connected to redis");
await redis.connect();
console.timeEnd("connected to redis");

console.log("connecting to db");
console.time("connected to db");
await prisma.$connect();
console.timeEnd("connected to db");

export default prisma;
