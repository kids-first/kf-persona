import { schemaComposer } from 'graphql-compose';

import generateUserTC from './schema/User';
import { adminOrPublicGate, adminOrSelfGate, idGate, isActiveGate, isAdminGate, selfGate } from './aclGates';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import { Model } from 'mongoose';
import { User } from '../schema/userType';
import { GraphQLSchema } from 'graphql/type/schema';

const restrict = (resolver, ...restrictions) =>
    resolver.wrapResolve((next) => async (rp) => {
        await Promise.all(restrictions.map((r) => r(rp)));
        return next(rp);
    });

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
export const createSchema = (userModel: Model<User>): GraphQLSchema => {
    const UserTC = generateUserTC(userModel);
    const UserRestrictedTC = composeWithMongoose(userModel, {
        schemaComposer,
        name: 'UserRestrictedModel',
        fields: { remove: ['email', 'egoId', 'institutionalEmail'] },
    });

    schemaComposer.Query.addFields({
        self: restrict(UserTC.getResolver('self')),
        user: restrict(
            UserRestrictedTC.getResolver('findById'), //builtin api of graphql compose mongoose https://github.com/graphql-compose/graphql-compose-mongoose
            adminOrPublicGate(
                userModel,
                'Access denied. This profile is not public. (You may also access this resource with Admin privileges).',
            ),
        ),
        fullUser: restrict(
            UserTC.getResolver('findById'), //builtin api of graphql compose mongoose https://github.com/graphql-compose/graphql-compose-mongoose
            isAdminGate('Access denied. You need Admin privileges to access this resource'),
        ),
        users: restrict(
            UserTC.getResolver('pagination'),
            isAdminGate('Access denied. You need Admin privileges to access this resource'),
        ),
    });

    schemaComposer.Mutation.addFields({
        userCreate: restrict(UserTC.getResolver('createOne')),
        userRemove: restrict(
            UserTC.getResolver('removeById'),
            adminOrSelfGate(
                userModel,
                `Access denied. You need admin access to perform this action on someone else's account`,
            ),
        ),
        userUpdate: restrict(
            UserTC.getResolver('updateById'),
            selfGate(userModel, `You can't edit someone elses profile`),
            idGate(userModel, "You can't change your ego id"),
            isActiveGate(
                userModel,
                "You need to be admin to deactivate a user's account",
                'You cannot make public a inactive account. Activate it first',
            ),
        ),
        userUpdateAdmin: restrict(
            UserTC.getResolver('toggleActivity'),
            isAdminGate('Only an ADMIN user can change the activity status of a profile'),
        ),
    });
    return schemaComposer.buildSchema();
};
