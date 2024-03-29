import dotenv from 'dotenv';

dotenv.config();

export const port = process.env.PORT || 3232;

export const keycloakUrl = process.env.KEYCLOAK_URL || 'https://kf-keycloak-qa.kf-strides.org/auth';
export const keycloakRealm = process.env.KEYCLOAK_REALM || 'kidsfirstdrc';
export const keycloakClient = process.env.KEYCLOAK_CLIENT || 'kidsfirst-apis';

export const kfMailchimpListId = process.env.KF_MAILCHIMP_LIST_ID || '';
export const kfMailchimpApiKey = process.env.KF_MAILCHIMP_API_KEY || '';
export const kfMailchimpUserName = process.env.KF_MAILCHIMP_USERNAME || '';
export const kfDatasetSubscriptionListId = process.env.KF_DATASET_SUBSCRIPTION_LIST_ID || '';

export const mongoHost = process.env.MONGO_HOST || 'localhost';
export const mongoDb = process.env.MONGO_DB || 'test';
export const mongoUser = process.env.MONGO_USER;
export const mongoPass = process.env.MONGO_PASS;

export const sqsQueueUrl = process.env.SQS_QUEUE_URL;
