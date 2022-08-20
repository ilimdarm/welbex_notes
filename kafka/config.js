import { Kafka } from 'kafkajs'

const kafkaBroker = 'localhost:9092'

export const kafkaTopic = 'message-queue'
export const kafkaGroupId = 'message-queue-group'
export const KafkaClient = new Kafka({
    brokers: [kafkaBroker]
})