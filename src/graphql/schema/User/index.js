import { composeWithMongoose } from 'graphql-compose-mongoose';

const self = UserModel => ({context}) => UserModel.findOne({egoId: context.jwt.sub});

export default ({ models }) => {
  const UserTC = composeWithMongoose(models.User, {});

  UserTC.addResolver({
    kind: 'query',
    name: 'self',
    type: UserTC,
    resolve: self(models.User),
  });

  return UserTC;
};
