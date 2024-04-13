import {
  BadRequest
} from "./chunk-XOE66WP7.mjs";
import {
  prisma
} from "./chunk-MFUVHSTY.mjs";

// src/routes/get-event.ts
import { z } from "zod";
async function getEvent(app) {
  app.withTypeProvider().get("/events/:eventId", {
    schema: {
      summary: "Get an event",
      // Resumo da rota
      tags: ["events"],
      // Tags para a documentação da API
      params: z.object({
        eventId: z.string().uuid()
      }),
      response: {
        200: z.object({
          event: z.object({
            id: z.string().uuid(),
            title: z.string(),
            slug: z.string(),
            details: z.string().nullable(),
            maximumAttendees: z.number().int().nullable(),
            attendeesAmount: z.number().int()
          })
        })
      }
    }
  }, async (request, reply) => {
    const { eventId } = request.params;
    const event = await prisma.event.findUnique({
      // Buscar o evento pelo ID
      select: {
        // Selecionar os campos expecificos que serão retornados
        id: true,
        title: true,
        slug: true,
        details: true,
        maximumAttendees: true,
        _count: {
          // Contar o número de participantes cadastrados no evento
          select: {
            attendees: true
          }
        }
      },
      where: {
        id: eventId
      }
    });
    if (event == null) {
      throw new BadRequest("Event not found");
    }
    return reply.send({
      event: {
        id: event.id,
        title: event.title,
        slug: event.slug,
        details: event.details,
        maximumAttendees: event.maximumAttendees,
        attendeesAmount: event._count.attendees
      }
    });
  });
}

export {
  getEvent
};
