export default (model, sqs, queueName) => async (req, res) => {
    if (!queueName)
        return Promise.resolve(res.status(500).json({message: 'There is no queue defined!'}))
    await model.find({})
        .exec()
        .then(function (users) {
            return res.json(users);
        }).catch(function (err) {
            return res.status(500).json(err);
        });
};
