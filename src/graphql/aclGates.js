import { AccessError } from "../errors";

const APPROVED_STATUS = "approved";

// conditions
const isAdmin = ({ context: { jwt } }) => {
  const roles = jwt?.context?.user?.roles || [];
  return roles.includes("ADMIN");
};

const isApplication = ({ context: { jwt } }) => {
  const applicationStatus = jwt?.context?.application?.status || "";
  return applicationStatus.toLowerCase() === APPROVED_STATUS;
};

const isSelf = (models) => async ({ args, context }) => {
  const _id = args._id || args.record._id;
  const egoId = await models.User.findOne({ _id }).then((user) => user.egoId);
  return `${egoId}` === `${context.jwt.sub}`;
};

const isPublicProfile = (models) => async ({ args }) => {
  const _id = args._id || args.record._id;
  const isPublic = await models.User.findOne({ _id }).then(
    (doc) => doc.isPublic
  );
  return Boolean(isPublic);
};

const defaultErrorMessage = "Access denied";

const error = (message = defaultErrorMessage) => {
  return new AccessError(message);
};

// gates
export const isAdminGate = ({ errMsg }) => async ({ context }) => {
  if (!isAdmin({ context })) {
    throw error(errMsg);
  }
};

export const idGate = ({ models, errMsg }) => async ({ args }) => {
  const _id = args._id || args.record._id;
  const egoId = await models.User.findOne({ _id }).then((user) => user.egoId);
  if (args.record && args.record.egoId !== egoId) {
    throw error(errMsg);
  }
};

export const isActiveGate = ({
  models,
  errMsgTglActivity,
  errMsgTglPrivacy,
}) => async ({ args }) => {
  const _id = args._id || args.record._id;
  const isActive = args.isActive || args.record.isActive;
  const isPublic = args.isPublic || args.record.isPublic;
  const current = await models.User.findOne({ _id });

  const isTogglingActive = isActive && isActive !== current.isActive;
  const isDeactivatedTryPublic = !current.isActive && isPublic;
  if (isTogglingActive) throw error(errMsgTglActivity);
  if (isDeactivatedTryPublic) throw error(errMsgTglPrivacy);
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

export const adminOrAppOrPublicGate = ({
  models,
  errMsg = defaultErrorMessage,
}) => async ({ args, context }) => {
  const passesGate =
    isAdmin({ context }) ||
    isApplication({ context }) ||
    (await isPublicProfile(models)({ args, context }));

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

export const makeProfilePublicGate = ({ models, errMsg }) => async ({
  args,
}) => {
  const { _id, isPublic } = args;
  const doc = await models.User.findOne({ _id });
  /** @namespace doc.isPublic */
  /** @namespace doc.jobTitle */
  const isProfileToUpdatePublic = isPublic;
  const isPersistedProfileAlreadyPublic = doc.isPublic;
  if (isPersistedProfileAlreadyPublic || !isProfileToUpdatePublic) {
    return;
  }

  const persistedRole = doc.roles[0];
  if (["research"].includes(persistedRole)) {
    const persistedJobTitle = doc.jobTitle;
    if (!persistedJobTitle || !persistedJobTitle.trim()) {
      throw error(
        errMsg ||
          'The field "job title" for a researcher is required to make the profile public'
      );
    }
  }
};
