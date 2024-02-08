import CryptoJS from 'crypto-js'
import { sql } from '../../db.js'
import TokenInvalid from '../error/tokenInvalid.js'

class AuthenticationController {
    async validate(login){

        const loginSQL = await sql`
            select 
                al.*
            from 
                aut_login al,
                aut_password ap
            where al.id = ap.login_id
                and ap.actual_flag = true
                and COALESCE(al.disable_date,CURRENT_TIMESTAMP + INTERVAL '1 minute') > CURRENT_TIMESTAMP
                and al.login = ${login.login}
                and ap.password like ${CryptoJS.SHA3(login.password).toString()}
        `

        return await this.getToken(loginSQL, true);

    }

    async validateToken(token, getToken = false){

        let rowLogin = {}

        if (!token) {
            throw new TokenInvalid();
        }

        const loginSQL = await sql`
            select 
                al.*
            from 
                aut_login al,
                aut_login_log alog
            where al.id = alog.login_id
                and alog.id = ${token}
                and alog.creation_date > CURRENT_TIMESTAMP - INTERVAL '3 hour'
                and COALESCE(al.disable_date,CURRENT_TIMESTAMP + INTERVAL '1 minute') > CURRENT_TIMESTAMP
            group by al.id
        `

        if (loginSQL.count = 0) {
            throw new TokenInvalid();
        }

        if (getToken) {
            return await this.getToken(loginSQL)
        } 

        loginSQL.map(row =>{
            rowLogin = row
        })

        return rowLogin

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
                    request.routeOptions.config.login = login
                } else {
                    reply.code(401).send()
                }
    
            } else if (request.headers.authorization) {
                
                const login = await this.validateToken(request.headers.authorization,true)
                
                if (login.approved_login) {
                    request.routeOptions.config.login = login
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

    async getToken(login){
        let rowLogin = {}

        login.map(row =>{
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
}

export default AuthenticationController