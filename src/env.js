export const port = process.env.PORT || 3232;

export const egoURL = process.env.EGO_API;

export const vaultAppSecretPath =
  process.env.VAULT_APP_SECRET_PATH || "secret/app";

export const kfMailchimpListId = process.env.KF_MAILCHIMP_LIST_ID || "";
export const kfMailchimpApiKey = process.env.KF_MAILCHIMP_API_KEY || "";
export const kfMailchimpUserName = process.env.KF_MAILCHIMP_USERNAME || "";

export const nihSubscriptionMailFromAddress =
  process.env.NIH_SUBSCRIPTION_MAIL_FROM_ADDRESS;
export const nihSubscriptionMailTargetAddress =
  process.env.NIH_SUBSCRIPTION_MAIL_TARGET_ADDRESS;
export const nihSubscriptionMailUserName =
  process.env.NIH_SUBSCRIPTION_MAIL_USERNAME;
export const nihSubscriptionMailPass = process.env.NIH_SUBSCRIPTION_MAIL_PASS;
