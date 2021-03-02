import dotenv from 'dotenv';

dotenv.config();
export const port = process.env.PORT || 3232;

export const egoURL = process.env.EGO_API;

export const kfMailchimpListId = process.env.KF_MAILCHIMP_LIST_ID || '';
export const kfMailchimpApiKey = process.env.KF_MAILCHIMP_API_KEY || '';
export const kfMailchimpUserName = process.env.KF_MAILCHIMP_USERNAME || '';
export const kfDatasetSubscriptionListId =
  process.env.KF_DATASET_SUBSCRIPTION_LIST_ID || '';

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

export const sqsQueueUrl = process.env.SQS_QUEUE_URL;

// dev | qa | prd
export const nodeEnv = process.env.NODE_ENV || 'dev';
