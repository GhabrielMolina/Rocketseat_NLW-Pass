import { PrismaClient } from "@prisma/client";

// Conexão com o banco de dados
export const prisma = new PrismaClient({
  log: ['query'], // Exibir as queries no console usando o Prisma (Comando na api.http -> Send Request)
});