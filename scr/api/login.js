import fp from 'fastify-plugin'

const loginRest = fp((fastify,opts,done)=>{
    fastify.get('/login',(request,reply)=>{
        reply.statusCode(200);
    })
    done()
})

export default loginRest