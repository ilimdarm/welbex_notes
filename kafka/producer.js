import { KafkaClient, kafkaTopic } from "./config.js"

export const sendMessageToQueue = async (message) => {
    const producer = KafkaClient.producer()
    await producer.connect()
    await producer.send({
            topic: kafkaTopic,
            messages: [
            {
                value: JSON.stringify(message) 
            }
            ]
    })
    await producer.disconnect()
}