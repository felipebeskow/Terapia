// tutorial https://www.youtube.com/watch?v=hHM-hr9q4mo
import { fastify } from 'fastify'
import InitSQL from './scr/initSql.js'

// console.log(process.env.DATABASE_URL)

const server = fastify()


server.get('/hello', () => {
    return 'Hello World'
})

InitSQL();


server.listen({
    port:process.env.PORT ?? 3000
})