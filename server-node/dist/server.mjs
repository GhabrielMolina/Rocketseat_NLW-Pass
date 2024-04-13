import {
  registerForEvent
} from "./chunk-SS5G3BTF.mjs";
import {
  errorHandler
} from "./chunk-IP6D6OCS.mjs";
import {
  checkIn
} from "./chunk-354R42SI.mjs";
import {
  createEvent
} from "./chunk-HCWIUQYL.mjs";
import "./chunk-KDMJHR3Z.mjs";
import {
  getAttendeeBadge
} from "./chunk-5MUW4SJU.mjs";
import {
  getEventAttendees
} from "./chunk-UAB2GU36.mjs";
import {
  getEvent
} from "./chunk-SWE6TMH2.mjs";
import "./chunk-XOE66WP7.mjs";
import "./chunk-MFUVHSTY.mjs";

// src/server.ts
import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
var app = fastify().withTypeProvider();
app.register(fastifyCors, {
  origin: "*"
  // Permitir requisições para API de qualquer origem (URL) (Segurança colocar o domínio do front-end 'http://meufrontend.com')
});
app.register(fastifySwagger, {
  // fastifySwagger é um plugin que gera a documentação da API	
  swagger: {
    // Configuração do plugin
    consumes: ["application/json"],
    // Todos os dados enviados para o servidor devem ser JSON
    produces: ["application/json"],
    // Todos os dados enviados pelo servidor serão JSON
    info: {
      // Informações sobre a API
      title: "pass-in",
      description: "Especifica\xE7\xF5es da API para o back-end da aplica\xE7\xE3o Pass-In construida durante o NLW Unite da Rocketseat",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
  // Transformar os schemas Zod em JSON Schema
});
app.register(fastifySwaggerUI, {
  // fastifySwaggerUI é um plugin que gera a interface gráfica da documentação da API
  routePrefix: "/docs"
  // Rota para acessar a documentação no localhost:3333/docs
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventAttendees);
app.setErrorHandler(errorHandler);
app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("HTTP server is running on port 3333");
});
export {
  app
};
