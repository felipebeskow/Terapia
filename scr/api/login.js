import fp from 'fastify-plugin'

const loginRest = fp((fastify,opts,done)=>{
    fastify.get('/login',(request,reply)=>{
        reply.send(request.context.login)
    })

    fastify.post('/login',(request,reply)=>{
        console.log(request.body)
        reply.code(501).send({body: request.body})       
    })

    fastify.patch('/login',(request,reply)=>{
        console.log(request.body)
        reply.code(501).send({body: request.body})       
    })
    
    fastify.delete('/login',(request,reply)=>{
        reply.code(501).send()
    })

    done()
})

export default loginRest