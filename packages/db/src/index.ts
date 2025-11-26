import { env } from "@director_v2/config";
import { PrismaMariaDb as PrismaMySQL } from "@prisma/adapter-mariadb";
import Redis from "ioredis";
import { PrismaClient } from "../prisma/generated/client";

const dbURL = new URL(env.DATABASE_URL);
const adapter = new PrismaMySQL({
  host: dbURL.hostname,
  port: Number(dbURL.port),
  user: dbURL.username,
  password: dbURL.password,
  database: dbURL.pathname.substring(1),

  // never disconnect from db
  idleTimeout: 0,
});

const prisma = new PrismaClient({
  adapter,
});

export default prisma;

export const redis = new Redis({
  lazyConnect: true,
});

async function preconnectRedis() {
  console.log("connecting to redis");
  console.time("connected to redis");
  await redis.connect();
  console.timeEnd("connected to redis");
}

async function preconnectToDb() {
  console.log("connecting to db");
  console.time("connected to db");
  await prisma.$connect();
  console.timeEnd("connected to db");
}

export async function preconnectToDbAndRedis() {
  console.time("connected to db and redis");
  await Promise.all([preconnectRedis(), preconnectToDb()]);
  console.timeEnd("connected to db and redis");
}
