import { generateMemberList } from '../services/csvGenerator'


export default (model) => (req, res) => {
    model
        .find({})
        .exec()
        .then((users => generateMemberList(users, res)));

};
