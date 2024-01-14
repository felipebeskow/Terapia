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

    changePassword(){

    }
}

export default loginController
