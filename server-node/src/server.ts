import fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'; // https://github.com/turkerdev/fastify-type-provider-zod
import { createEvent } from './routes/create-event';
import { registerForEvent } from './routes/register-for-event';
import { getEvent } from './routes/get-event';
import { getAttendeeBadge } from './routes/get-attendee-badge';
import { checkIn } from './routes/check-in';
import { getEventAttendees } from './routes/get-event-attendees';

const app = fastify();

// Adicionar o plugin do fastify-type-provider-zod
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent) // Registrar a rota de criação de eventos
app.register(registerForEvent) // Registrar a rota de criação de participantes em um evento
app.register(getEvent) // Registrar a rota de dados dos eventos
app.register(getAttendeeBadge) // Registrar a rota de dados dos participantes
app.register(checkIn) // Registrar a rota de check-in de participantes
app.register(getEventAttendees) // Registrar a rota de busca todos participantes de um evento

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server is running on port 3333');
});