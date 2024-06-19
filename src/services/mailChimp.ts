import fetch from 'node-fetch';
import { User } from '../schema/userType';
import { MailChimpSecrets } from './secrets';

type MailchimpResponse = {
    subscription: string;
    status: string;
    detail?: string;
};

type Subscription = {
    type: string;
    url: string;
};

export const newMailchimpSubscription = async (
    user: User,
    mailchimpSecret: MailChimpSecrets,
): Promise<MailchimpResponse[]> => {
    const { kfMailchimpListId, kfMailchimpUserName, kfMailchimpApiKey, kfDatasetSubscriptionListId } = mailchimpSecret;
    const mailChimpDataCenter = kfMailchimpApiKey.split('-')[1];
    const buff = Buffer.from(`${kfMailchimpUserName}:${kfMailchimpApiKey}`);
    const b64 = buff.toString('base64');

    const subscriptions: Subscription[] = [];

    if (user.acceptedDatasetSubscriptionKfOptIn) {
        subscriptions.push({
            type: 'Dataset Subscription',
            url: `https://${mailChimpDataCenter}.api.mailchimp.com/3.0/lists/${kfDatasetSubscriptionListId}/members/`,
        });
    }

    if (user.acceptedKfOptIn) {
        subscriptions.push({
            type: 'Newsletter Subscription',
            url: `https://${mailChimpDataCenter}.api.mailchimp.com/3.0/lists/${kfMailchimpListId}/members/`,
        });
    }

    try {
        const responses = await Promise.all(
            subscriptions.map(async (subscription) => {
                const response = await fetch(subscription.url, {
                    method: 'POST',
                    headers: {
                        Authorization: `Basic ${b64}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email_address: user.email,
                        status: 'subscribed',
                        merge_fields: {
                            FNAME: user.firstName,
                            LNAME: user.lastName,
                        },
                    }),
                });

                const responseData = await response.json();

                if (!response.ok) {
                    console.error('Error subscribing to Mailchimp:', responseData);
                    throw new Error(responseData.detail || response.statusText);
                }

                return { subscription: subscription.type, status: 'subscribed', detail: responseData.detail };
            }),
        );

        return responses;
    } catch (error) {
        console.error('An error occurred while subscribing to Mailchimp:', error);
        throw new Error(`Subscription failed: ${error.message}`);
    }
};
