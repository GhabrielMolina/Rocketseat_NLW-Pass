import fastify from 'fastify';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'; // https://github.com/turkerdev/fastify-type-provider-zod
import { z } from 'zod'; // npm i zod (Validação dos dados da requisição)
import { PrismaClient } from '@prisma/client';
import { generateSlug } from './utils/generate-slug';

const app = fastify();

// Adicionar o plugin do fastify-type-provider-zod
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Conexão com o banco de dados
const prisma = new PrismaClient({
  log: ['query'], // Exibir as queries no console usando o Prisma (Comando na api.http -> Send Request)
});

// Métodos HTTP: GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD, ...

// Corpo da requisição (Request Body): http://localhost:3333/users
// Parâmetros de busca (Search Params / Query Params): http://localhost:3333/users?name=Ghabriel
// Parâmetros de rota (Route Params) -> Identificação de recursos 'DELETE http://localhost:3333/users/1'
// Cabeçalhos (Headers) -> Informações adicionais para a requisição

// Send Request -> Enviar requisição para o servidor
// ERROR
// 200 OK -> Sucesso
// 201 Created -> Registro criado com sucesso
// 300 Redirection -> Redirecionamento
// 400 Bad Request -> Erro na requisição do cliente (Erro em alguma informação enviada por quem fez a requisição para API)
// 500 Internal Server Error -> Erro no servidor (Erro no servidor que está processando a requisição, independente do que esta sendo enviado)


app
  .withTypeProvider<ZodTypeProvider>() // Adicionar o tipo de provider do Zod
  .post('/events', { // Criar um evento
    schema: { // Definir o schema de validação
      body: z.object({ // Validar pelo fastify o corpo da requisição se está de acordo com o schema
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable(),
      }),
      response: { // Resposta da requisição
        201: z.object({ 
          eventId: z.string().uuid(),
        })
      },
    },
  }, async (request, reply) => {
    const {
      title,
      details,
      maximumAttendees,
    } = request.body // Obter os dados do corpo da requisição

    const slug = generateSlug(title); // Gerar o slug a partir do título do evento

    const eventWithSameSlug = await prisma.event.findUnique({ // Verificar se já existe um evento unico com o mesmo slug
      where: {
        slug,
      }
    })

    if (eventWithSameSlug != null) { // Caso o eventWithSameSlug não seja nulo, já existe um evento com o mesmo slug
      throw new Error('Another event with same title already exists.')
    }

    const event = await prisma.event.create({ // Create retorna uma Promise por isso o await
      data: {
        title,
        details,
        maximumAttendees,
        slug,
      },
    })

    return reply.status(201).send({ eventId: event.id }); // 201 Created -> Registro criado com sucesso
  })

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server is running on port 3333');
});