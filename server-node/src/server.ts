import fastify from 'fastify';

const app = fastify();

// Métodos HTTP: GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD, ...
// Parâmetros de busca (Search Params / Query Params): http://localhost:3333/users?name=Ghabriel
// Parâmetros de rota (Route Params) -> Identificação de recursos 'DELETE http://localhost:3333/users/1'
// Cabeçalhos (Headers) -> Informações adicionais para a requisição

app.get('/', () => {
  return 'Hello World!';
})

app.listen({ port: 3333}).then(() => {
  console.log('HTTP server is running on port 3333');
});