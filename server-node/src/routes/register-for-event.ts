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

      // Cadastrando usuario no evento
      const attendee = await prisma.attendee.create ({
        data: {
          name,
          email,
          eventId,
        }
      })

      return reply.status(201).send({attendeeId: attendee.id}) // Enviando o id do participante como resposta
    })
} // Registrar a rota de criação de participantes em um evento no server.ts