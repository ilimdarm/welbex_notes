import bcrypt from "bcrypt"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"
import {post_req} from "./localrequests.js"
import { data, roles } from "../databases/users_db.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({path: path.resolve(__dirname, '../.env')})

export const createUser = async (body, callback) => {
    await data.findOne({
        where: {login:body.login}
    }).then(async (result) => {
        if(result){
            return callback({
                state: 0,
                error: 'Логин уже существует!'
            })
        }
        body.password = await bcrypt.hash(body.password, 3)
        body.activation_token = uuidv4()
        body.token = await jwt.sign({ login: body.login, email: body.email }, process.env.JWT_PRIVATE_KEY, { expiresIn: 86400 * 30 })
        let role = await roles.findOne({where: {title: body.role}})
        body.role_id = role.id
        delete body.role
        let res = await data.create(body)
        if (!res){
            return callback({
                state: 0
            })
        }
        let mailOptions = {
            to: body.email,
            subject: "Активация учетной записи",
            text: "",
            html: `
                <div>
                    <h1>Здравствуйте, ${body.login}!</h1>
                    <h2>Благодарим за регистрацию! Для активации учетной записи перейдите по ссылке:</h2>
                    <a href="${process.env.HOST_ADDRESS}:${process.env.USER_SERVICE_PORT}/users/activate/${body.activation_token}">Активировать</a>
                </div>`
        }
        post_req(process.env.MAIL_SERVICE_PORT, '/mail_send', mailOptions)
        return callback({
            state: 1
        })
    })
}

export const getUsers = async (callback) => {
    let res = await data.findAll()
    return callback({
        state: 1,
        body: res
    })
}

export const deleteUser = async (body, callback) => {
    await data.findOne({
        where: {id:body.id}
    }).then(async (result) => {
        if(!result){
            return callback({
                state: 0,
                error: 'Ошибка! Пользователя не существует!'
            })
        }
        await data.destroy({
            where: {id:body.id}
        })
        return callback({
            state: 1,
        })
    })
}

export const getUserInfo = async (body, callback) => {
    await data.findOne({
        where: {id:body.id}
    }).then(async (result) => {
        if(!result){
            return callback({
                state: 0,
                error: 'Ошибка! Пользователя не существует!'
            })
        }
        return callback({
            state: 1,
            body: result
        })
    })
}

export const updateUser = async (body, callback) => {
    if (body.data.password)
        body.data.password = await bcrypt.hash(body.data.password, 3)
    await data.findOne({
        where: {id:body.id}
    }).then(async (result) => {
        if(!result){
            return callback({
                state: 0,
                error: 'Ошибка! Пользователя не существует!'
            })
        }
        await data.update(
            body.data,
            { where: { id:body.id }}
        )
        return callback({
            state: 1,
        })
    })
}
export const activateAccount = async (activation_token, callback) => {
    await data.findOne({
        where: {activation_token}
    }).then((result) => {
        if(!result){
            return callback({
                state: 0,
                error: 'Ошибка! Пользователя не существует!'
            })
            
        }
        if (result.activated){
            return callback({
                state: 0,
                error: 'Вы уже активировали учетную запись'
            })
        }
        result.set({activated: true})
        result.save()
        return callback('Учетная запись успешно активирована!')
    })
}

export const authUser = async (body, callback) => {
    await data.findOne({
        where: {login: body.login}
    }).then(async (result) => {
        if(!result){
            return callback({
                state: 0,
                error: 'Пользователь с таким логином не существует!'
            })
        }
        let check_pass = await bcrypt.compare(body.password, result.password)
        if (!check_pass){
            return callback({
                state: 0,
                error: 'Неверный пароль!'
            })
        }
        let token = await jwt.sign({ login: result.login, email: result.email }, process.env.JWT_PRIVATE_KEY, { expiresIn: 86400 * 30 })
        await data.update(
            {token},
            {where: {login: body.login}}
        )
        return callback({
            state: 1,
            token
        })
    })
}

export const checkAuth = async (body, callback) => {
    await data.findOne({
        where: {token: body.token}
    }).then((result) => {
        if(!result){
            return callback(false)
        }
        delete result.activation_token
        return callback({result})
    })
}

export const createRole = async (body, callback) => {
    await roles.findOne({
        where: body
    }).then(async (result) => {
        if(result){
            return callback({
                state: 0,
                error: 'Роль уже существует!'
            })
        }
        let res = await roles.create(body)
        if (!res){
            return callback({
                state: 0
            })
        }
        return callback({
            state: 1
        })
    })
}
export const getRoles = async (callback) => {
    await roles.findAll().then(async (result) => {
        if(!result){
            return callback({
                state: 0
            })
        }
        return callback(result)
    })
}

export const getRoleInfo = async (id, callback) => {
    await roles.findOne({
        where: {id}
    }).then(async (result) => {
        if(!result){
            return callback(false)
        }
        return callback(result)
    })
}

