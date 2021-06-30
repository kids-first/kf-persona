import AWS from 'aws-sdk';

import { User } from '../schema/userType';

export const sendMessage = (sqs: AWS.SQS, queueUrl: string) => (user: User) => {
    const params = { MessageBody: JSON.stringify(user), QueueUrl: queueUrl };
    return sqs.sendMessage(params).promise();
};

export const stubSendMessage = (user: User) => {
    // eslint-disable-next-line no-console
    console.log(user);
    return Promise.resolve({ MessageId: user._id });
};
