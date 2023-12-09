import CryptoJS from 'crypto-js'
import { sql } from '../../db.js'

class loginController {
    create(login){

    }

    list(){

    }

    async validate(login){
        const response = await sql`
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
        
        if (response.count != 1) return false
        return response[0].approved_login

    }

    changePassword(){

    }
}

export default loginController
