// Rota para buscar todos os participantes de um evento

import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function getEventAttendees(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/events/:eventId/attendees", {
      schema: {
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {},
      }
    }, async (request,reply) => {
      const { eventId } = request.params

      const attendees = await prisma.attendee.findMany({
        where: {
          eventId,
        }
      })
      return reply.send({ attendees })
    })
} // Registrar a rota de busca todos participantes de um evento server.ts