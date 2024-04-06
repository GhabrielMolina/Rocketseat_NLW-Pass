import fastify from 'fastify';
import { z } from 'zod'; // npm i zod (Validação dos dados da requisição)
import { PrismaClient } from '@prisma/client';

const app = fastify();

// Conexão com o banco de dados
const prisma = new PrismaClient({
  log: ['query'], // Exibir as queries no console usando o Prisma (Comando na api.http -> Send Request)
});

// Métodos HTTP: GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD, ...

// Corpo da requisição (Request Body): http://localhost:3333/users
// Parâmetros de busca (Search Params / Query Params): http://localhost:3333/users?name=Ghabriel
// Parâmetros de rota (Route Params) -> Identificação de recursos 'DELETE http://localhost:3333/users/1'
// Cabeçalhos (Headers) -> Informações adicionais para a requisição

app.post('/events', async (request, reply) => {
  
  const createEventSchema = z.object({ // Definir o schema de validação
    title: z.string().min(4),
    details: z.string().nullable(),
    maximumAttendees: z.number().int().positive().nullable(),
  })

  const data = createEventSchema.parse(request.body); // Validar o corpo da requisição se está de acordo com o schema

  const event = await prisma.event.create({ // Create retorna uma Promise por isso o await
    data: {
      title: data.title,
      details: data.details,
      maximunAttendees: data.maximumAttendees,
      slug: new Date().toISOString(),
    }
  })

  return reply.code(201).send({eventId: event.id}); // 201 Created -> Registro criado com sucesso
})

app.listen({ port: 3333}).then(() => {
  console.log('HTTP server is running on port 3333');
});