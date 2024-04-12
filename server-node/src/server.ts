import fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'; // https://github.com/turkerdev/fastify-type-provider-zod
import { createEvent } from './routes/create-event';
import { registerForEvent } from './routes/register-for-event';

const app = fastify();

// Adicionar o plugin do fastify-type-provider-zod
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent) // Registrar a rota de criação de eventos
app.register(registerForEvent) // Registrar a rota de criação de participantes em um evento

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server is running on port 3333');
});