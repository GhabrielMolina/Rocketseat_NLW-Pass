// Rota para retornar todos os dados de um unico evento (Para poder aplicar em uma página de inscrição para evento)

import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getEvent(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/events/:eventId', {
      schema: {
        summary: 'Get an event', // Resumo da rota
        tags: ['events'], // Tags para a documentação da API
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            event: z.object({
              id: z.string().uuid(),
              title: z.string(),
              slug: z.string(),
              details: z.string().nullable(),
              maximumAttendees: z.number().int().nullable(),
              attendeesAmount: z.number().int(),
            })
          })
        },
      }
    }, async (request, reply) => {
      const { eventId } = request.params

      const event = await prisma.event.findUnique({ // Buscar o evento pelo ID
        select: { // Selecionar os campos expecificos que serão retornados
          id: true,
          title: true,
          slug: true,
          details: true,
          maximumAttendees: true,
          _count: { // Contar o número de participantes cadastrados no evento
            select: {
              attendees: true,
            }
          },
        },
        where: {
          id: eventId,
        }
      })

      if (event == null) { // Se o evento não for encontrado, retornar um erro
        throw new Error('Event not found')
      }

      return reply.send({
        event: {
          id: event.id,
          title: event.title,
          slug: event.slug,
          details: event.details,
          maximumAttendees: event.maximumAttendees,
          attendeesAmount: event._count.attendees,
        },
      })
    })
} // Registrar a rota de dados dos eventos no server.ts