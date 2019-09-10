export default (model, send) => async (req, res) => {
    await model.find({})
        .exec()
        .then((users) =>
            Promise.all(users.map(u => send(u)))
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
