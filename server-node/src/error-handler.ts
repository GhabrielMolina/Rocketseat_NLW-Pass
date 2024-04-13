import { FastifyInstance } from "fastify"
import { BadRequest } from "./utils/_errors/bad-request"
import { ZodError } from "zod"

type fastifyErrorHandler = FastifyInstance['errorHandler'] // Definir o tipo do errorHandler

export const errorHandler: fastifyErrorHandler = (error, request, reply) => { // Criar um errorHandler para tratar os erros

  if( error instanceof ZodError) { // Verificar se o erro é uma instância de ZodError
    return reply.status(400).send({ 
      message: 'Error during validation', // Retornar uma mensagem de erro
      errors: error.flatten().fieldErrors, // Retornar os erros de validação do Zod flatten para facilitar a leitura
    })
  }
  
  if(error instanceof BadRequest){ // Verificar se o erro é uma instância de BadRequest
    return reply.status(400).send({ message: error.message }) // Retornar o erro com status 400
  }
  
  return reply.status(500).send({ message: 'Internal Server Error'})
}