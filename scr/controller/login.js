import CryptoJS from 'crypto-js'
import { sql } from '../../db.js'

class loginController {
    create(login){

    }

    list(){

    }

    async validate(login){
        const login = await sql`
        select 
            case 
            when count(*) = 1 then true 
            else false 
            end approved_login
        from 
            aut_login al,
            aut_password ap
        where al.id = ap.login_id
            and ap.actual_flag = true
            and al.login = ${login.login}
            and ap.password like ${CryptoJS.SHA3(login.password).toString()}
        `
        
        if (login.count == 1 && login[0].approved_login){
            const log = await sql`
            insert into aut_login_log (
                login_id,
                last_update_login,
                creation_login,log
            ) values (
                ${login[0].id},
                ${login[0].id},
                ${login[0].id},
                ${{
                    login: login[0].id,
                    env: process.env
                }}
            ) returning id`
            if (log.count == 1 && log[0].id){
                return log[0].id
            }
        }
        return null;

    }

    changePassword(){

    }
}

export default loginController
