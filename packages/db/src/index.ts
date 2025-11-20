import { PrismaClient } from "../prisma/generated/client";

const prisma = new PrismaClient({
  log: ["query"],
});

export default prisma;
