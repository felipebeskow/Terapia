import fastify from 'fastify'
import InitSQL from './scr/initSql.js'
import loginRest from './scr/api/login.js'
import loginController from './scr/controller/login.js'

const server = fastify()

await InitSQL()

server.addHook('onRequest', async (request, reply) => {
    
    if (request.headers.authorization.split(" ")[0] == 'Basic'){
        const [username, password] = Buffer.from(request.headers.authorization.split(" ")[1], 'base64').toString().split(':')
    
        const login = await new loginController().validate({
            login: username,
            password: password
        })
        
        if (login.approved_login) {
            request.context.login = login
        } else {
            reply.code(401).send()
        }

    } else if (request.headers.authorization) {
        
        const login = await new loginController().validateToken(request.headers.authorization)
        
        if (login.approved_login) {
            request.context.login = login
        } else {
            reply.code(401).send()
        }
        
    }
    

})

server.register(loginRest)

console.log('Port:' + process.env.PORT)
server.listen({
    port:process.env.PORT ?? 3000
})
