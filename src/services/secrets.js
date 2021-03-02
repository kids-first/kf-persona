import {
  // mailchimp secrets
  kfMailchimpListId as envKfMailchimpListId,
  kfMailchimpApiKey as envKfMailchimpApiKey,
  kfMailchimpUserName as envKfMailchimpUserName,
  kfDatasetSubscriptionListId as envkfDatasetSubscriptionListId
} from '../env';

export const retrieveSecrets = () =>
  Promise.resolve({
    mailchimpSecret: {
      kfMailchimpListId: envKfMailchimpListId,
      kfMailchimpApiKey: envKfMailchimpApiKey,
      kfMailchimpUserName: envKfMailchimpUserName,
      kfDatasetSubscriptionListId: envkfDatasetSubscriptionListId
    }
  });
