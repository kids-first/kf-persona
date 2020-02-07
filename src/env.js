import dotenv from 'dotenv';

dotenv.config();
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


export const egoApi = process.env.EGO_API;

export const mongoHost = process.env.MONGO_HOST || 'localhost';
export const mongoDb = process.env.MONGO_DB || 'test';
export const mongoUser = process.env.MONGO_USER;
export const mongoPass = process.env.MONGO_PASS;

export const useVault = process.env.USE_VAULT === 'true';
export const vaultEndpointProtocol = process.env.VAULT_ENDPOINT_PROTOCOL;
export const vaultHost = process.env.VAULT_HOST;
export const vaultPort = process.env.VAULT_PORT;
export const vaultApiVersion = process.env.VAULT_API_VERSION;
export const vaultToken = process.env.VAULT_TOKEN;
export const vaultAuthentication = process.env.VAULT_AUTHENTICATION;
export const vaultAwsIamRole = process.env.AWS_IAM_ROLE;
export const vaultMongoCredentialPath = process.env.VAULT_MONGO_CREDENTIAL_PATH;
export const vaultMongoUsernameKey =
    process.env.MONGO_USERNAME_KEY || 'mongodb-username';
export const vaultMongoUserpassKey =
    process.env.MONGO_USERPASS_KEY || 'mongodb-pass';
export const sqsQueueUrl = process.env.SQS_QUEUE_URL;
export const supportEmail = process.env.SUPPORT_EMAIL_FOR_INAPPROPRIATE_CONTENT;