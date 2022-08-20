import fastify from "fastify"
import cors from "fastify-cors"
import {post_req} from "./logic/localrequests.js"
import {createNote, getNotes, deleteNote, getNoteInfo, updateNote, checkAuth} from "./logic/notes.js"

const app = fastify()
app.register(cors)

app.post("/notes/create", {
    schema: {
        body: {
            type: "object",
            required: ["token", "data"],
            propertion: {
                token: {
                    type: "string",
                },
                data: {
                    type: "object",
                }
            }
        }
    }
}, async (req, res) => {
    await checkAuth({token: req.body.token}).then((check) => {
        if (!check){
            return res.send({
                state: 0
            })
        }
        return createNote(req.body.data, (response) => {
            res.send(response)
        })
    })
    
})
app.post("/notes/get_all", {
    schema: {
        body: {
            type: "object",
            required: ["token"],
            propertion: {
                token: {
                    type: "string",
                }
            }
        }
    }
}, (req, res) => {
    if (!checkAuth({token: req.body.token})){
        return res.send({
            state: 0
        })
    }
    return getNotes((response) => {
        res.send(response)
    })
})
app.post("/notes/delete", {
    schema: {
        body: {
            type: "object",
            required: ["id"],
            propertion: {
                id: {
                    type: "int",
                }
            }
        }
    }
}, (req, res) => {
    if (!checkAuth({token: req.body.token})){
        return res.send({
            state: 0
        })
    }
    return deleteNote(req.body, (response) => {
        res.send(response)
    })
})
app.post("/notes/get_one", {
    schema: {
        body: {
            type: "object",
            required: ["id"],
            propertion: {
                id: {
                    type: "int",
                }
            }
        }
    }
}, (req, res) => {
    if (!checkAuth({token: req.body.token})){
        return res.send({
            state: 0
        })
    }
    return getNoteInfo(req.body, (response) => {
        res.send(response)
    })
})
app.post("/notes/update", {
    schema: {
        body: {
            type: "object",
            required: ["id"],
            propertion: {
                id: {
                    type: "int",
                },
                data: {
                    type: "object",
                }
            }
        }
    }
}, (req, res) => {
    if (!checkAuth({token: req.body.token})){
        return res.send({
            state: 0
        })
    }
    return updateNote(req.body, (response) => {
        res.send(response)
    })
})

app.listen(process.env.NOTES_SERVICE_PORT).then(e => {
    console.log(e)
})
