import { ObjectTypeComposer } from 'graphql-compose';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import { Model } from 'mongoose';
import { User } from '../../../schema/userType';

const self =
    (userModel: Model<User>) =>
    ({ context }) =>
        userModel.findOne({ egoId: context['kauth'].grant.access_token.content.user_id });

const toggleActivity =
    (userModel: Model<User>) =>
    ({ args }) =>
        userModel.findById(args._id, function (err, doc) {
            if (doc) {
                if (doc.isActive) {
                    doc.isPublic = false;
                }
                doc.isActive = !doc.isActive;
                doc.save();
            }
        });

export default (userModel: Model<User>): ObjectTypeComposer<User> => {
    const UserTC = composeWithMongoose(userModel);

    UserTC.addResolver({
        kind: 'query',
        name: 'self',
        type: UserTC,
        resolve: self(userModel),
    });

    UserTC.addResolver({
        kind: 'mutation',
        args: {
            _id: 'MongoID!',
            isActive: 'Boolean',
        },
        name: 'toggleActivity',
        type: UserTC,
        resolve: toggleActivity(userModel),
    });

    return UserTC;
};
