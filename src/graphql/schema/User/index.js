import { composeWithMongoose } from 'graphql-compose-mongoose';

const self = UserModel => ({ context }) =>
  UserModel.findOne({ egoId: context.jwt.sub });

const admin = UserModel => ({ args }) =>
  UserModel.findByIdAndUpdate(
    { _id: args._id },
    args.isActive
      ? { isActive: args.isActive }
      : { isActive: args.isActive, isPublic: false },
    { new: true }
  );

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
    resolve: admin(models.User)
  });

  return UserTC;
};
