import fastify from 'fastify'
import InitSQL from './scr/initSql.js'
import loginRest from './scr/api/login.js'
import AuthenticationController from './scr/controller/authentication.js'

const server = fastify()

await InitSQL()

server.addHook('onRequest', async (request, reply) => {
    await new AuthenticationController().authentication(request, reply)
})

server.register(loginRest)

console.log('Port:' + process.env.PORT)
server.listen({
    port:process.env.PORT ?? 3000
})
