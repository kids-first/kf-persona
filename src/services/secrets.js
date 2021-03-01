import {
  // email secrets
  nihSubscriptionMailUserName as envNihSubscriptionMailUserName,
  nihSubscriptionMailPass as envNihSubscriptionMailPass,
  // mailchimp secrets
  kfMailchimpListId as envKfMailchimpListId,
  kfMailchimpApiKey as envKfMailchimpApiKey,
  kfMailchimpUserName as envKfMailchimpUserName,
  kfDatasetSubscriptionListId as envkfDatasetSubscriptionListId
} from '../env';

const mailchimpSecretFallback = {
  kfMailchimpListId: envKfMailchimpListId,
  kfMailchimpApiKey: envKfMailchimpApiKey,
  kfMailchimpUserName: envKfMailchimpUserName,
  kfDatasetSubscriptionListId: envkfDatasetSubscriptionListId
};

const emailSecretFallback = {
  user: envNihSubscriptionMailUserName,
  pass: envNihSubscriptionMailPass
};

export const retrieveSecrets = () =>
  Promise.resolve({
    emailSecret: emailSecretFallback,
    mailchimpSecret: mailchimpSecretFallback
  });
