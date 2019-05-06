export const port = process.env.PORT || 3232;

export const egoURL = process.env.EGO_API;

export const vaultMailchimpSecretPath = process.env.VAULT_MAILCHIMP_SECRET_PATH;
export const vaultEmailSecretPath = process.env.VAULT_EMAIL_SECRET_PATH;

export const kfMailchimpListId = process.env.KF_MAILCHIMP_LIST_ID || "";
export const kfMailchimpApiKey = process.env.KF_MAILCHIMP_API_KEY || "";
export const kfMailchimpUserName = process.env.KF_MAILCHIMP_USERNAME || "";
export const kfDatasetSubscriptionListId = process.env.KF_DATASET_SUBSCRIPTION_LIST_ID || "";

export const nihSubscriptionMailFromAddress =
  process.env.NIH_SUBSCRIPTION_MAIL_FROM_ADDRESS;
export const nihSubscriptionMailTargetAddress =
  process.env.NIH_SUBSCRIPTION_MAIL_TARGET_ADDRESS;
export const nihSubscriptionMailUserName =
  process.env.NIH_SUBSCRIPTION_MAIL_USERNAME;
export const nihSubscriptionMailPass = process.env.NIH_SUBSCRIPTION_MAIL_PASS;
