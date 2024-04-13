import fastify from 'fastify';

// npm i @fastify/swagger && npm i @fastify/swagger-ui
import fastifySwagger from '@fastify/swagger'; // https://github.com/fastify/fastify-swagger
import fastifySwaggerUI from '@fastify/swagger-ui';
import fastifyCors from '@fastify/cors'; // npm i @fastify/cors

import { serializerCompiler, validatorCompiler, jsonSchemaTransform, ZodTypeProvider } from 'fastify-type-provider-zod'; // https://github.com/turkerdev/fastify-type-provider-zod
import { createEvent } from './routes/create-event';
import { registerForEvent } from './routes/register-for-event';
import { getEvent } from './routes/get-event';
import { getAttendeeBadge } from './routes/get-attendee-badge';
import { checkIn } from './routes/check-in';
import { getEventAttendees } from './routes/get-event-attendees';
import { errorHandler } from './error-handler';

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, { 
  origin: '*', // Permitir requisições para API de qualquer origem (URL) (Segurança colocar o domínio do front-end 'http://meufrontend.com')
})

app.register(fastifySwagger, { // fastifySwagger é um plugin que gera a documentação da API	
  swagger: { // Configuração do plugin
    consumes: ['application/json'], // Todos os dados enviados para o servidor devem ser JSON
    produces: ['application/json'], // Todos os dados enviados pelo servidor serão JSON
    info: { // Informações sobre a API
      title: 'pass-in',
      description: 'Especificações da API para o back-end da aplicação Pass-In construida durante o NLW Unite da Rocketseat',
      version: '1.0.0'
    },
  },
  transform: jsonSchemaTransform, // Transformar os schemas Zod em JSON Schema
})

app.register(fastifySwaggerUI, { // fastifySwaggerUI é um plugin que gera a interface gráfica da documentação da API
  routePrefix: '/docs', // Rota para acessar a documentação no localhost:3333/docs
})

// Adicionar o plugin do fastify-type-provider-zod
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent) // Registrar a rota de criação de eventos
app.register(registerForEvent) // Registrar a rota de criação de participantes em um evento
app.register(getEvent) // Registrar a rota de dados dos eventos
app.register(getAttendeeBadge) // Registrar a rota de dados dos participantes
app.register(checkIn) // Registrar a rota de check-in de participantes
app.register(getEventAttendees) // Registrar a rota de busca todos participantes de um evento

app.setErrorHandler(errorHandler)

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server is running on port 3333');
});