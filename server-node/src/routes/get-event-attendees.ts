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
        summary: 'Get event attendees', // Resumo da rota
        tags: ['events'], // Tags para a documentação da API
        params: z.object({
          eventId: z.string().uuid(),
        }),
        querystring: z.object({ // querystring é uma string de consulta, que é uma parte de uma URL que contém dados que geralmente são passados para um programa do lado do servidor como parâmetros de consulta. 
          query: z.string().nullish(), // query é o nome do participante que será pesquisado // nullish() é um método que pode retornar o tipo nulo
          pageIndex: z.string().nullish().default('0').transform(Number), // pageIndex é o índice da página
        }),
        response: {
          200: z.object({
            attendees: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
                email: z.string().email(),
                createdAt: z.date(),
                checkedInAt: z.date().nullable(),
              })
            ),
            total: z.number(),
          }),
        },
      }
    }, async (request, reply) => {
      const { eventId } = request.params
      const { query, pageIndex } = request.query // request.query é um objeto que contém as chaves e valores dos parâmetros de consulta da URL 

      const [attendees, total] = await Promise.all([ // Promisse.all() é um método que retorna uma única promessa que resolve quando todas as promessas no argumento iterável forem resolvidas ou quando o iterável contém zero promessas.])
        prisma.attendee.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            checkIn: { // checkIn é um objeto que contém as chaves e valores dos dados de check-in
              select: {
                createdAt: true,
              }
            }
          },
          where: query ? { // Se a query não for nula, procurar por um nome que contenha a query
            eventId,
            name: {
              contains: query, // Procurar por um nome que contenha a query
            }
          } : {
            eventId,
          },
          take: 10, // Limitar a 10 participantes por requisição
          skip: pageIndex * 10, // Pular os participantes das páginas anteriores
          orderBy: { // Ordenar por data de criação
            createdAt: 'desc', // Ordenar por data de criação em ordem decrescente
          }
        }),
        prisma.attendee.count({ // Contar o número total de participantes
          where: query ? { // Se a query não for nula, procurar por um nome que contenha a query
            eventId,
            name: {
              contains: query, // Procurar por um nome que contenha a query
            }
          } : {
            eventId,
          },
        })
      ])

      return reply.send({
        attendees: attendees.map(attendee => {
          return {
            id: attendee.id,
            name: attendee.name,
            email: attendee.email,
            createdAt: attendee.createdAt,
            checkedInAt: attendee.checkIn?.createdAt ?? null, // mesma coisa que attendee.checkIn ? attendee.checkIn.createdAt : null
          }
        }),
        total,
      })
    })
} // Registrar a rota de busca todos participantes de um evento server.ts