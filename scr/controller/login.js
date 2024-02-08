import CryptoJS from 'crypto-js'
import { sql } from '../../db.js'
import TokenInvalid from '../error/tokenInvalid.js'
import ImpossibleDeleteUser from '../error/impossibleDeleteUser.js';
import AuthenticationController from './authentication.js';

class loginController {
    async create(login,token){
        const user = await new AuthenticationController().validateToken(token)

        if (!user) {
            throw new TokenInvalid();
        }

        const insertLogin = await sql`
            insert into aut_login (
                login,
                last_update_login,
                creation_login,
                display_name
            ) values (
                ${login.login},
                ${user.id},
                ${user.id},
                ${login.display_name}
            ) returning *
        `
        let rowInsert = {}
        insertLogin.map(row=>{
            rowInsert = row
        })

        return rowInsert
    }

    async list(filter){
        let query
        let result = []
        if (filter){
            query = await sql`
                select 
                    al.*
                from 
                    aut_login al
                where display_name like ${ filter.display_name || sql`display_name`} || '%'
                    and login like ${ filter.login || sql`login` } || '%'
                group by al.id
                order by al.login
            `
        } else {
            query = await sql`
                select 
                    al.*
                from 
                    aut_login al
                group by al.id
                order by al.login
            `
        }

        query.map(row => {
            result.push(row)
        })

        return result

    }

    async set(login,loginId,autLoginId){
        const updateLogin = await sql`
            update aut_login
            set ${sql({
                ...login,
                last_update_date: sql`now()`,
                last_update_login: autLoginId
            })}
            where id = ${loginId}
            returning *
        `

        let user
        updateLogin.map(row=>{
            user = row
        })

        return user
    }

    async changePassword(password,loginId,autLoginId){
        await sql`
            update aut_password
                set actual_flag = false,
                    last_update_date = now(),
                    last_update_login = ${autLoginId}
            where login_id = ${loginId}
        `

        const insertPassword = await sql`
            insert into aut_password (
                login_id,
                password,
                actual_flag,
                last_update_login,
                creation_login
            ) select 
                ${loginId} login_id, 
                ${CryptoJS.SHA3(password)} password,
                true actual_flag,
                ${autLoginId} last_update_login,
                ${autLoginId} creation_login
            where not exists (
                select 1 from aut_password ap
                where ap.actual_flag = true
                    and ap.login_id = ${loginId}
            ) returning login_id, true new_password
        `
        let data 
        insertPassword.map(row=>{
            data = row
        })

        return data

    }

    async delete (loginIdDeleted,loginId){
        const deleteUser = await sql`
            update aut_login
            set 
                disable_date = CURRENT_TIMESTAMP,
                last_update_login = ${loginId},
                last_update_date = now()
            where id = ${loginIdDeleted}
            returning *
        `
        
        if (deleteUser.count == 0){
            throw new ImpossibleDeleteUser();
        }

        let user
        deleteUser.map(row=>{
            user = row
        })

        return user
    }
}

export default loginController
