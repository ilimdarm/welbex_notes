import { sendMessageToQueue } from "./producer.js"
import { KafkaClient, kafkaTopic, kafkaGroupId } from "./config.js"
import { sendMail } from "../logic/mail_sender.js"

export const consumeMessage = async () => {
    const consumer = KafkaClient.consumer({
        groupId: kafkaGroupId,
    })

    await consumer.connect()
    await consumer.subscribe({ topic: kafkaTopic, fromBeginning: true})

    await consumer.run({
        autoCommit: false, 
        eachMessage: async ({ topic, partition, message}) => {
            const {to, subject, text, html} = JSON.parse(message.value.toString())
            try {
                sendMail(to, subject, text, html)
            } catch (error) {
                console.error(error)
                await sendMessageToQueue(messageData)
            } finally {
                const offset = message.offset + 1
                await consumer.commitOffsets([{topic: kafkaTopic, partition, offset: offset.toString()}])
            }
        }
    })
}