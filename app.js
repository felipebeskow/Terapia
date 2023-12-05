// tutorial https://www.youtube.com/watch?v=hHM-hr9q4mo


import { fastify } from "fastify";
import 'dotenv/config';

const server = fastify()


server.get('/hello', () => {
    return 'Hello World'
})


server.listen({
    port:process.env.PORT ?? 3333
})