import { env } from "@director_v2/config";
import { PrismaMariaDb as PrismaMySQL } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../prisma/generated/client";

const prisma = new PrismaClient({
  adapter: new PrismaMySQL(env.DATABASE_URL),
});

export default prisma;
