// tutorial https://www.youtube.com/watch?v=hHM-hr9q4mo


import { fastify } from "fastify";
//import { DatabaseMemory } from "./database-memory.js";

const server = fastify();


server.get('/', () => {
    return 'Hello World'
})


server.listen({
    port:3333
})