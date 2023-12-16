// tutorial https://www.youtube.com/watch?v=hHM-hr9q4mo
import { fastify } from 'fastify'
import InitSQL from './scr/initSql.js'


const server = fastify()


server.get('/hello', () => {
    return 'Hello World'
})

await InitSQL();

import loginRest from './scr/api/login.js'
server.register(loginRest)

server.listen({
    port:process.env.PORT ?? 3000
})