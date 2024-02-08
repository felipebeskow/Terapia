import fp from 'fastify-plugin'
import loginController from '../controller/login.js'

const loginRest = fp((fastify,opts,done)=>{
    
    fastify.get('/login', async (request,reply)=>{
        const filter = request.query
        const users = await new loginController().list(filter)
        reply.send({
            data: users,
            token: request.routeOptions.config.login.token,
            filter
        })
    })

    fastify.post('/login', async (request,reply)=>{
        const token = request.routeOptions.config.login.token
        
        const userCreated = await new loginController().create(request.body,token)
        reply.send({
            data: userCreated,
            token
        })
    
    })

    fastify.patch('/login/:id', async (request,reply)=>{
        const data = await new loginController().set(request.body,request.params.id,request.routeOptions.config.login.id)
        reply.send({
            data: data,
            token: request.routeOptions.config.login.token
        })
    })

    fastify.post('/login/:id/changePassword', async (request,reply)=>{
        const data = await new loginController().changePassword(request.body.password,request.params.id,request.routeOptions.config.login.id)
        reply.send({
            data: data,
            token: request.routeOptions.config.login.token
        })
    })
    
    fastify.delete('/login/:id', async (request,reply)=>{
        const login = await new loginController().delete(request.params.id,request.routeOptions.config.login.id)
        reply.send({
            data: login,
            token: request.routeOptions.config.login.token
        })
    })

    done()
})

export default loginRest