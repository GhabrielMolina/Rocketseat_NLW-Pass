import {
  BadRequest
} from "./chunk-XOE66WP7.mjs";
import {
  prisma
} from "./chunk-MFUVHSTY.mjs";

// src/routes/register-for-event.ts
import { z } from "zod";
async function registerForEvent(app) {
  app.withTypeProvider().post("/events/:eventId/attendees", {
    // :eventId (No festify : é um coringa para receber uma informção dinamica)
    schema: {
      summary: "Register an attendee",
      // Resumo da rota
      tags: ["attendees"],
      // Tags para a documentação da API
      body: z.object({
        name: z.string().min(4),
        email: z.string().email()
      }),
      params: z.object({
        eventId: z.string().uuid()
      }),
      response: {
        201: z.object({
          attendeeId: z.number()
        })
      }
    }
  }, async (request, reply) => {
    const { name, email } = request.body;
    const { eventId } = request.params;
    const attendeeFromEmail = await prisma.attendee.findUnique({
      // Verificar se já existe um participante com o mesmo email
      where: {
        eventId_email: {
          // Composto de eventId e email (Chave composta) criada no schema.prisma
          email,
          eventId
        }
      }
    });
    if (attendeeFromEmail != null) {
      throw new BadRequest("Attendee already registered for this event.");
    }
    const [event, amountOfAttendeesForEvent] = await Promise.all([
      //  Para as duas querys do banco de dados executar em paralelo e não sequencialmente ja que leva algum tempo com o await
      prisma.event.findUnique({
        // Verificar se o evento existe e pega os dados dele
        where: {
          id: eventId
        }
      }),
      prisma.attendee.count({
        // Verifica a quantidade de participantes no evento
        where: {
          eventId
        }
      })
    ]);
    if (event?.maximumAttendees && amountOfAttendeesForEvent >= event.maximumAttendees) {
      throw new BadRequest("Event is full.");
    }
    const attendee = await prisma.attendee.create({
      data: {
        name,
        email,
        eventId
      }
    });
    return reply.status(201).send({ attendeeId: attendee.id });
  });
}

export {
  registerForEvent
};
