import dotenv from "dotenv"
import path from "path"
import {post_req} from "./localrequests.js"
import { fileURLToPath } from "url"
import { notes } from "../databases/notes_db.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({path: path.resolve(__dirname, '../.env')})

export const createNote = async (body, callback) => {
    await notes.create(body).then((result) => {
        if(!result){
            return callback({
                state: 0,
                error: 'Ошибка создания заметки'
            })
        }
        return callback({
            state: 1
        })
    })
}

export const getNotes = async (callback) => {
    let res = await notes.findAll()
    return callback({
        state: 1,
        body: res
    })
}

export const deleteNote = async (body, callback) => {
    await notes.findOne({
        where: {id:body.id}
    }).then(async (result) => {
        if(!result){
            return callback({
                state: 0,
                error: 'Ошибка! Заметки не существует!'
            })
        }
        await notes.destroy({
            where: {id:body.id}
        })
        return callback({
            state: 1,
        })
    })
}

export const getNoteInfo = async (body, callback) => {
    await notes.findOne({
        where: {id:body.id}
    }).then(async (result) => {
        if(!result){
            return callback({
                state: 0,
                error: 'Ошибка! Заметки не существует!'
            })
        }
        await notes.destroy({
            where: {id:body.id}
        })
        return callback({
            state: 1,
            body: result
        })
    })
}

export const updateNote = async (body, callback) => {
    await notes.findOne({
        where: {id:body.id}
    }).then(async (result) => {
        if(!result){
            return callback({
                state: 0,
                error: 'Ошибка! Заметки не существует!'
            })
        }
        await notes.update(
            body.data,
            { where: { id:body.id }}
        )
        return callback({
            state: 1,
        })
    })
}

export const checkAuth = async (body) => {
    return await post_req(process.env.USER_SERVICE_PORT, '/users/check_auth', body)
}
