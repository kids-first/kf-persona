import {
    // mailchimp secrets
    kfMailchimpListId as envKfMailchimpListId,
    kfMailchimpApiKey as envKfMailchimpApiKey,
    kfMailchimpUserName as envKfMailchimpUserName,
    kfDatasetSubscriptionListId as envkfDatasetSubscriptionListId,
} from '../env';

export type MailChimpSecrets = {
    kfMailchimpListId: string;
    kfMailchimpApiKey: string;
    kfMailchimpUserName: string;
    kfDatasetSubscriptionListId: string;
};

export const mailChimpSecrets: MailChimpSecrets = {
    kfMailchimpListId: envKfMailchimpListId,
    kfMailchimpApiKey: envKfMailchimpApiKey,
    kfMailchimpUserName: envKfMailchimpUserName,
    kfDatasetSubscriptionListId: envkfDatasetSubscriptionListId,
};
