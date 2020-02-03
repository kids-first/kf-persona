import { generateMemberList } from '../services/csvGenerator'


export default (model) => async (req, res) => {
    await  model
        .find({})
        .exec()
        .then((users => generateMemberList(users, res)))
        .catch(err => {
        res.status(500).json(err);
    });

};
