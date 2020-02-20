import { composeWithMongoose } from 'graphql-compose-mongoose';

const self = UserModel => ({ context }) =>
  UserModel.findOne({ egoId: context.jwt.sub });

const toggleActivity = UserModel => ({ args }) =>
  UserModel.findById(args._id, function(err, doc) {
    if (doc) {
      if (doc.isActive) {
        doc.isPublic = false;
      }
      doc.isActive = !doc.isActive;
      doc.save();
    }
  });

export default ({ models }) => {
  const UserTC = composeWithMongoose(models.User, {});

  UserTC.addResolver({
    kind: 'query',
    name: 'self',
    type: UserTC,
    resolve: self(models.User)
  });

  UserTC.addResolver({
    kind: 'mutation',
    args: {
      _id: 'MongoID!',
      isActive: 'Boolean'
    },
    name: 'toggleActivity',
    type: UserTC,
    resolve: toggleActivity(models.User)
  });

  return UserTC;
};
