import fastify from "fastify"
import cors from "fastify-cors"
import {sendMessageToQueue} from "./kafka/producer.js"
import {consumeMessage } from "./kafka/queue.js"

const app = fastify()
app.register(cors)

app.post("/mail_send", {
    schema: {
        body: {
            type: "object",
            required: ["to"],
            propertion: {
                to: {
                    type: "string",
                },
                subject: {
                    type: "string",
                },
                text: {
                    type: "string",
                },
                html: {
                    type: "string",
                }
            }
        }
    }
}, async (req, res) => {
    await sendMessageToQueue(req.body)
    await consumeMessage()
    return res.send({
        state: 1
    })
})

app.listen(process.env.MAIL_SERVICE_PORT).then(e => {
    console.log(e)
})
