export const sendMessage = (sqs, queueUrl) => user => {
    const params = {MessageBody: user, QueueUrl: queueUrl};
    return sqs.sendMessage(params).promise();

};

export const stubSendMessage = user => {
    console.log(user);
    return Promise.resolve(
        { MessageId: user._id }
    );

};