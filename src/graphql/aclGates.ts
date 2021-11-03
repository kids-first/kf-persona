import { Model } from 'mongoose';
import { AccessError } from '../errors';
import { User } from '../schema/userType';

// conditions
const isAdmin = ({ context }) => {
    const roles = context['kauth'].grant.access_token.content.realm_access.roles || [];
    return roles.includes('ADMIN');
};

const isSelf =
    (userModel: Model<User>) =>
    async ({ args, context }) => {
        const _id = args._id || args.record._id;
        const egoId = await userModel.findOne({ _id }).then((user) => user.egoId);
        return `${egoId}` === `${context['kauth'].grant.access_token.content.sub}`;
    };

const isPublicProfile =
    (userModel: Model<User>) =>
    async ({ args }) => {
        const _id = args._id || args.record._id;
        const isPublic = await userModel.findOne({ _id }).then((doc) => (doc !== null ? doc.isPublic : false));
        return Boolean(isPublic);
    };

const defaultErrorMessage = 'Access denied';

const error = (message = defaultErrorMessage) => new AccessError(message);

// gates
export const isAdminGate =
    (errMsg: string) =>
    async ({ context }): Promise<void> => {
        if (!isAdmin({ context })) {
            throw error(errMsg);
        }
    };

export const idGate =
    (userModel: Model<User>, errMsg: string) =>
    async ({ args }): Promise<void> => {
        const _id = args._id || args.record._id;
        const egoId = await userModel.findOne({ _id }).then((user) => user.egoId);
        if (args.record && args.record.egoId !== egoId) {
            throw error(errMsg);
        }
    };

export const isActiveGate =
    (userModel: Model<User>, errMsgTglActivity: string, errMsgTglPrivacy: string) =>
    async ({ args }): Promise<void> => {
        const _id = args._id || args.record._id;
        const isActive = args.isActive || args.record.isActive;
        const isPublic = args.isPublic || args.record.isPublic;
        const current = await userModel.findOne({ _id });

        const isTogglingActive = isActive && isActive !== current.isActive;
        const isDeactivatedTryPublic = !current.isActive && isPublic;
        if (isTogglingActive) throw error(errMsgTglActivity);
        if (isDeactivatedTryPublic) throw error(errMsgTglPrivacy);
    };

export const selfGate =
    (userModel: Model<User>, errMsg: string = defaultErrorMessage) =>
    async ({ args, context }): Promise<void> => {
        if (!(await isSelf(userModel)({ args, context }))) {
            throw error(errMsg);
        }
    };

export const adminOrPublicGate =
    (userModel: Model<User>, errMsg: string = defaultErrorMessage) =>
    async ({ args, context }): Promise<void> => {
        const passesGate = isAdmin({ context }) || (await isPublicProfile(userModel)({ args }));

        if (!passesGate) {
            throw error(errMsg);
        }
    };

export const adminOrSelfGate =
    (userModel: Model<User>, errMsg: string = defaultErrorMessage) =>
    async ({ args, context }): Promise<void> => {
        const passesGate = isAdmin({ context }) || (await isSelf(userModel)({ args, context }));

        if (!passesGate) {
            throw error(errMsg);
        }
    };
