import fp from 'fastify-plugin'

const loginRest = fp((fastify,opts,done)=>{
    fastify.get('/login',(request,reply)=>{
        reply.code(501).send()
    })

    fastify.post('/login',(request,reply)=>{
        reply.code(501).send()        
    })

    done()
})

export default loginRest