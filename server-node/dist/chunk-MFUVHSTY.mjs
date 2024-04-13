// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient({
  log: ["query"]
  // Exibir as queries no console usando o Prisma (Comando na api.http -> Send Request)
});

export {
  prisma
};
