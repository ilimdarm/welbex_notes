import fastify from "fastify"
import cors from "fastify-cors"
import {createUser, getUsers, deleteUser, getUserInfo, updateUser, authUser, checkAuth, activateAccount, createRole, getRoles, getRoleInfo} from "./logic/users.js"

const app = fastify()
app.register(cors)

app.post("/users/create", {
    schema: {
        body: {
            type: "object",
            required: ["login", "password", "email", "role"],
            propertion: {
                login: {
                    type: "string",
                    "minLength": 3,
                    "maxLength": 20
                },
                password: {
                    type: "string",
                    "minLength": 3,
                    "maxLength": 40
                },
                email: {
                    type: "string",
                },
                role: {
                    type: "string",
                }
            }
        }
    }
}, (req, res) => {
    return createUser(req.body, (response) => {
        res.send(response)
    })
})
app.post("/users/get_all",  {
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
}, async (req, res) => {
    await checkAuth(req.body, async (user) => {
        if(!user){
            return res.send({
                state: 0,
                error: 'No valid token'
            })
        }
        await getRoleInfo(user.result.role_id, (role) => {
            if (role.level != 0){
                return res.send({
                    state: 0
                })
            }  
        })
        return getUsers((response) => {
            res.send(response)
        })
    })
})
app.post("/users/delete", {
    schema: {
        body: {
            type: "object",
            required: ["id", "token"],
            propertion: {
                id: {
                    type: "int",
                },
                token: {
                    type: "string",
                }
            }
        }
    }
}, async (req, res) => {
    await checkAuth(req.body, async (user) => {
        if(!user){
            return res.send({
                state: 0,
                error: 'No valid token'
            })
        }
        await getRoleInfo(user.result.role_id, (role) => {
            if (role.level != 0){
                return res.send({
                    state: 0
                })
            }  
        })
        return deleteUser(req.body, (response) => {
            res.send(response)
        })
    })
})
app.post("/users/get_one", {
    schema: {
        body: {
            type: "object",
            required: ["id", "token"],
            propertion: {
                id: {
                    type: "int",
                },
                token: {
                    type: "string",
                }
            }
        }
    }
}, async (req, res) => {
    await checkAuth(req.body, async (user) => {
        if(!user){
            return res.send({
                state: 0,
                error: 'No valid token'
            })
        }
        await getRoleInfo(user.result.role_id, (role) => {
            if (role.level != 0){
                return res.send({
                    state: 0
                })
            }  
        })
        return getUserInfo(req.body, (response) => {
            res.send(response)
        })
    })
})
app.post("/users/update", {
    schema: {
        body: {
            type: "object",
            required: ["id", "data", "token"],
            propertion: {
                id: {
                    type: "int",
                },
                data: {
                    type: "object",
                },
                token: {
                    type: "string",
                }
            }
        }
    }
}, async (req, res) => {
    await checkAuth(req.body, async (user) => {
        if(!user){
            return res.send({
                state: 0,
                error: 'No valid token'
            })
        }
        await getRoleInfo(user.result.role_id, (role) => {
            if (role.level != 0){
                return res.send({
                    state: 0
                })
            }  
        })
        return updateUser(req.body, (response) => {
            res.send(response)
        })
    })
})
app.post("/users/auth", {
    schema: {
        body: {
            type: "object",
            required: ["login", "password"],
            propertion: {
                login: {
                    type: "string",
                },
                password: {
                    type: "string",
                }
            }
        }
    }
}, (req, res) => {
    return authUser(req.body, (response) => {
        res.send(response)
    })
})
app.post("/users/check_auth", {
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
    return checkAuth(req.body, (response) => {
        res.send(response)
    })
})
app.get("/users/activate/:token", (req, res) => {
    return activateAccount(req.params.token, (response) => {
        res.send(response)
    })
})
app.post("/roles/create", {
    schema: {
        body: {
            type: "object",
            required: ["title", "level"],
            propertion: {
                title: {
                    type: "string",
                    "minLength": 3,
                    "maxLength": 40
                },
                level: {
                    type: "int",
                    "minimum": 0,
                    "maximum": 5
                }
            }
        }
    }
}, (req, res) => {
    return createRole(req.body, (response) => {
        res.send(response)
    })
})

app.get("/roles/get_all", (req, res) => {
    return getRoles((response) => {
        res.send(response)
    })
})



app.listen(process.env.USER_SERVICE_PORT).then(e => {
    console.log(e)
})
