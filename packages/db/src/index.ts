import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { env } from "../../config";
import { PrismaClient } from "../prisma/generated/client";

const adapter = new PrismaMariaDb(env.DATABASE_URL);
const prisma = new PrismaClient({
  adapter,
  log: ["query"],
});

console.log("connecting to db");
await prisma.$connect();
console.log("connected to db");

export default prisma;
