import CryptoJS from 'crypto-js'
import { sql } from '../../db.js'

class loginController {
    create(login){

    }

    list(){

    }

    async validate(login){
        
        let rowLogin = {}

        const loginSQL = await sql`
        select 
            al.*
        from 
            aut_login al,
            aut_password ap
        where al.id = ap.login_id
            and ap.actual_flag = true
            and al.login = ${login.login}
            and ap.password like ${CryptoJS.SHA3(login.password).toString()}
        `

        loginSQL.map(row =>{
            rowLogin = row
        })

        rowLogin.approved_login = false
        
        if (rowLogin.id){

            const log = await sql`
                insert into aut_login_log (
                    login_id,
                    last_update_login,
                    creation_login,
                    log
                ) values (
                    ${rowLogin.id},
                    ${rowLogin.id},
                    ${rowLogin.id},
                    ${{
                        login: rowLogin.id,
                        env: process.env
                    }}
                ) returning id
            `

            log.map(rowLog=>{
                rowLogin.token = rowLog.id
                rowLogin.approved_login = true
            })
        }

        return rowLogin;

    }

    async validateToken(token){
        
        let rowLogin = {}

        const loginSQL = await sql`
            select 
                al.*
            from 
                aut_login al,
                aut_login_log alog
            where al.id = alog.login_id
                and alog.id = ${token}
                and alog.creation_date > CURRENT_TIMESTAMP - INTERVAL '3 hour'
            group by al.id
        `

        loginSQL.map(row =>{
            rowLogin = row
        })

        rowLogin.approved_login = false
        
        if (rowLogin.id){

            const log = await sql`
                insert into aut_login_log (
                    login_id,
                    last_update_login,
                    creation_login,
                    log
                ) values (
                    ${rowLogin.id},
                    ${rowLogin.id},
                    ${rowLogin.id},
                    ${{
                        login: rowLogin.id,
                        env: process.env
                    }}
                ) returning id
            `

            log.map(rowLog=>{
                rowLogin.token = rowLog.id
                rowLogin.approved_login = true
            })
        }

        return rowLogin;
    }

    async authentication(request, reply) {
    
        if (request.headers.authorization) {
        
            if (request.headers.authorization.split(" ")[0] == 'Basic'){
                const [username, password] = Buffer.from(request.headers.authorization.split(" ")[1], 'base64').toString().split(':')
            
                const login = await this.validate({
                    login: username,
                    password: password
                })
                
                if (login.approved_login) {
                    request.context.login = login
                } else {
                    reply.code(401).send()
                }
    
            } else if (request.headers.authorization) {
                
                const login = await this.validateToken(request.headers.authorization)
                
                if (login.approved_login) {
                    request.context.login = login
                } else {
                    reply.code(401).send()
                }
                
            } else {
                reply.code(401).send()
    
            }
        } else {
            reply.code(401).send()
        }
    }

    changePassword(){

    }
}

export default loginController
