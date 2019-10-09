import { get } from 'lodash';
import {mongoDb, mongoHost} from "../env";
import {ObjectId, MongoClient} from "mongodb";
import {throws} from "assert"; // https://stackoverflow.com/questions/4902569/node-js-mongodb-select-document-by-id-node-mongodb-native

const APPROVED_STATUS = 'Approved'.toLowerCase();

// conditions
const isAdmin = ({ context: { jwt } }) => {
  const roles = get(jwt, 'context.user.roles', []);
  return roles.includes('ADMIN');
};

const isApplication = ({ context: { jwt } }) => {
  const applicationStatus = get(jwt, 'context.application.status', '');
  return applicationStatus.toLowerCase() === APPROVED_STATUS;
};

const isSelf = models => async ({ args, context }) => {
  const _id = args._id || args.record._id;
  const egoId = await models.User.findOne({ _id }).then(user => user.egoId);
  return `${egoId}` === `${context.jwt.sub}`;
};

const isPublicProfile = models => async ({ args, context }) => {
  const _id = args._id || args.record._id;
  const isPublic = await models.User.findOne({ _id }).then(doc => doc.isPublic);
  return  Boolean(isPublic)
};

const error = (message = defaultErrorMessage, status = 403) => {
  let err = new Error(message);
  err.status = 403;
  return err;
};

const defaultErrorMessage = 'Access denied';

// gates
export const idGate = ({ models, errMsg}) => async ({
  args,
  context,
}) => {
  const _id = args._id || args.record._id;
  const egoId = await models.User.findOne({ _id }).then(user => user.egoId);
  if (args.record && args.record.egoId !== egoId) {
    throw error(errMsg);
  }
};

export const selfGate = ({ models, errMsg = defaultErrorMessage }) => async ({
  args,
  context,
}) => {
  if (!(await isSelf(models)({ args, context }))) {
    throw error(errMsg);
  }
};

export const adminOrAppGate = ({ errMsg = defaultErrorMessage }) => async ({
  context: { jwt },
}) => {
  const passesGate =
    isAdmin({ context: { jwt } }) || isApplication({ context: { jwt } });

  if (!passesGate) {
      throw error(errMsg);
  }
};

export const adminOrAppOrPublicGate = ({ models, errMsg = defaultErrorMessage }) => async ({
    args,
 context,
}) => {
  const passesGate = isAdmin({ context }) || isApplication({ context }) || (await isPublicProfile(models)({ args, context }));

  if (!passesGate) {
      throw error(errMsg);
  }
};

export const adminOrSelfGate = ({
  models,
  errMsg = defaultErrorMessage,
}) => async ({ args, context }) => {
  const passesGate =
    isAdmin({ context }) || (await isSelf(models)({ args, context }));

  if (!passesGate) {
      throw error(errMsg);
  }
};

export const validTokenGate = ({ errMsg = defaultErrorMessage }) => async ({
  context,
}) => {
  if (!context.jwt.valid) throw error(errMsg);
};
