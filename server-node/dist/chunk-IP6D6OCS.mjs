import {
  BadRequest
} from "./chunk-XOE66WP7.mjs";

// src/error-handler.ts
import { ZodError } from "zod";
var errorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Error during validation",
      // Retornar uma mensagem de erro
      errors: error.flatten().fieldErrors
      // Retornar os erros de validação do Zod flatten para facilitar a leitura
    });
  }
  if (error instanceof BadRequest) {
    return reply.status(400).send({ message: error.message });
  }
  return reply.status(500).send({ message: "Internal Server Error" });
};

export {
  errorHandler
};
