import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function registerForEvent(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    // Cadastrando uma nova informação (participante com a tabela attendees no schema.prisma) em um evento específico
    .post('/events/:eventId/attendees', { // :eventId (No festify : é um coringa para receber uma informção dinamica)
      schema: {
        body: z.object({
          name: z.string().min(4),
          email: z.string().email(),
        }),
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            attendeeId: z.number(),
          })
        }
      }
    }, async (request, reply) => {
      const { name, email } = request.body // Dentro do request.body, pegar o nome e o email do participante
      const { eventId } = request.params // Dentro do request.params, pegar o eventId

      const attendeeFromEmail = await prisma.attendee.findUnique({ // Verificar se já existe um participante com o mesmo email
        where: {
          eventId_email: { // Composto de eventId e email (Chave composta) criada no schema.prisma
            email,
            eventId,
          }
        }
      })
      if (attendeeFromEmail != null) { // Caso o participante já esteja cadastrado no evento
        throw new Error('Attendee already registered for this event.')
      }

      
      const [event, amountOfAttendeesForEvent] = await Promise.all([ //  Para as duas querys do banco de dados executar em paralelo e não sequencialmente ja que leva algum tempo com o await

        prisma.event.findUnique({ // Verificar se o evento existe e pega os dados dele
          where: {
            id: eventId,
          }
        }),

        prisma.attendee.count({ // Verifica a quantidade de participantes no evento
          where: {
            eventId,
          }
        })
      ])

      if (event?.maximumAttendees && amountOfAttendeesForEvent >= event.maximumAttendees) { // Caso o evento tenha atingido o limite de participantes
        throw new Error('Event is full.')
      }

      // Cadastrando usuario no evento
      const attendee = await prisma.attendee.create({
        data: {
          name,
          email,
          eventId,
        }
      })

      return reply.status(201).send({ attendeeId: attendee.id }) // Enviando o id do participante como resposta
    })
} // Registrar a rota de criação de participantes em um evento no server.ts