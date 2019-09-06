import {sqsQueueName} from "../env";

export const getQueueUrl = (sqs) => {
    if (!sqsQueueName) {
        console.warn('There is no sqs queue defined!!!')
        return Promise.resolve(null)
    }
    return sqs.getQueueUrl({QueueName: sqsQueueName}).promise()
};