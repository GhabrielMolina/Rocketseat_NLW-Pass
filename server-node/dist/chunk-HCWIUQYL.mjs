import {
  generateSlug
} from "./chunk-KDMJHR3Z.mjs";
import {
  BadRequest
} from "./chunk-XOE66WP7.mjs";
import {
  prisma
} from "./chunk-MFUVHSTY.mjs";

// src/routes/create-event.ts
import { z } from "zod";
async function createEvent(app) {
  app.withTypeProvider().post("/events", {
    // Criar um evento com a tabela Event (schema.prisma)
    schema: {
      // Definir o schema de validação
      summary: "Create a new event",
      // Resumo da rota
      tags: ["events"],
      // Tags para a documentação da API
      body: z.object({
        // Validar pelo fastify o corpo da requisição se está de acordo com o schema
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable()
      }),
      response: {
        // Resposta da requisição
        201: z.object({
          eventId: z.string().uuid()
        })
      }
    }
  }, async (request, reply) => {
    const {
      title,
      details,
      maximumAttendees
    } = request.body;
    const slug = generateSlug(title);
    const eventWithSameSlug = await prisma.event.findUnique({
      // Verificar se já existe um evento unico com o mesmo slug
      where: {
        slug
      }
    });
    if (eventWithSameSlug != null) {
      throw new BadRequest("Another event with same title already exists.");
    }
    const event = await prisma.event.create({
      // Create retorna uma Promise por isso o await
      data: {
        title,
        details,
        maximumAttendees,
        slug
      }
    });
    return reply.status(201).send({ eventId: event.id });
  });
}

export {
  createEvent
};
