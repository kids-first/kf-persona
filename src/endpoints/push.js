const sendMessage = (sqs, queueUrl) => user => {
    const params = {MessageBody: user, QueueUrl: queueUrl};
    return sqs.sendMessage(params).promise();
};

export default (model, sqs, queueUrl) => async (req, res) => {
    if (!queueUrl)
        return Promise.resolve(res.status(500).json({message: 'Queue URL is not defined!'}));

    await model.find({})
        .exec()
        .then((users) =>
            Promise.all(users.map(u => sendMessage(sqs, queueUrl)(u)))
        )
        .then((results) => {
                res.send({
                    result: 'ok',
                    nbElementPushed: results.length,
                    messageIds: results.map(data => data.MessageId)
                });
            }
        ).catch(err => {
            res.status(500).json(err);
        });
};
