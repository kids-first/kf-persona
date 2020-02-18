import { GQC, SchemaComposer } from 'graphql-compose';

import generateUserTC from './schema/User';
import {
  adminOrAppGate,
  adminOrAppOrPublicGate,
  adminOrSelfGate,
  idGate,
  isActiveGate,
  isAdminGate,
  selfGate,
  validTokenGate
} from './aclGates';
import { composeWithMongoose } from 'graphql-compose-mongoose';

const restrict = (resolver, ...restrictions) => {
  return resolver.wrapResolve(next => async rp => {
    await Promise.all(restrictions.map(r => r(rp)));
    return next(rp);
  });
};

/**
 * Builds the models once, but allows us to change the body of the schema when we want.
 *
 * Returns a function that takes a requestedID that returns a schema.
 *
 * Possible refactoring: could have been done better from the get-go by passing the url directly to the resolvers
 * https://graphql-compose.github.io/docs/intro/quick-start.html , but we're working with old code here.
 *
 * @param models
 * @param tags
 */
export const createSchema = function({ models }) {
  const UserTC = generateUserTC({ models });
  const UserRestrictedTC = composeWithMongoose(models.User, {
    schemaComposer: new SchemaComposer(),
    name: 'UserRestrictedModel',
    fields: { remove: ['email', 'egoId', 'institutionalEmail'] }
  });

  const invalidTokenErrorMessage = 'You must provide valid token';

  GQC.rootQuery().addFields({
    self: restrict(
      UserTC.getResolver('self'),
      validTokenGate({ errMsg: invalidTokenErrorMessage })
    ),
    user: restrict(
      UserRestrictedTC.getResolver('findById'), //builtin api of graphql compose mongoose https://github.com/graphql-compose/graphql-compose-mongoose
      adminOrAppOrPublicGate({
        models,
        errMsg:
          'Access denied. This profile is not public. (You may also access this resource with Admin privileges).'
      })
    ),
    fullUser: restrict(
      UserTC.getResolver('findById'), //builtin api of graphql compose mongoose https://github.com/graphql-compose/graphql-compose-mongoose
      adminOrAppGate({
        errMsg:
          'Access denied. You need Admin privileges to access this resource'
      })
    ),
    users: restrict(
      UserTC.getResolver('pagination'),
      adminOrAppGate({
        errMsg:
          'Access denied. You need Admin privileges to access this resource'
      })
    )
  });

  GQC.rootMutation().addFields({
    userCreate: restrict(
      UserTC.getResolver('createOne'),
      validTokenGate({ errMsg: invalidTokenErrorMessage })
    ),
    userRemove: restrict(
      UserTC.getResolver('removeById'),
      validTokenGate({ errMsg: invalidTokenErrorMessage }),
      adminOrSelfGate({
        models,
        errMsg: `Access denied. You need admin access to perform this action on someone else's account`
      })
    ),
    userUpdate: restrict(
      UserTC.getResolver('updateById'),
      validTokenGate({ errMsg: invalidTokenErrorMessage }),
      selfGate({ models, errMsg: `You can't edit someone elses profile` }),
      idGate({ models, errMsg: "You can't change your ego id" }),
      isActiveGate({
        models,
        errMsgTglActivity: "You need to be admin to deactivate a user's account",
        errMsgTglPrivacy: "You cannot make public a inactive account. Activate it first"
      })
    ),
    userUpdateAdmin: restrict(
      UserTC.getResolver('toggleActivity'),
      validTokenGate({ errMsg: invalidTokenErrorMessage }),
      isAdminGate({
        errMsg: 'Only a ADMIN user can change the activity status of a profile'
      }),
    )
  });

  return GQC.buildSchema();
};
