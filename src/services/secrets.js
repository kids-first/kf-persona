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

export const retrieveSecrets = () =>
  Promise.resolve({
    emailSecret: {
      user: envNihSubscriptionMailUserName,
      pass: envNihSubscriptionMailPass
    },
    mailchimpSecret: {
      kfMailchimpListId: envKfMailchimpListId,
      kfMailchimpApiKey: envKfMailchimpApiKey,
      kfMailchimpUserName: envKfMailchimpUserName,
      kfDatasetSubscriptionListId: envkfDatasetSubscriptionListId
    }
  });
