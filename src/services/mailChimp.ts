import fetch from 'node-fetch';
import { User } from '../schema/userType';
import { MailChimpSecrets } from './secrets';

export const newMailchimpSubscription = async (user: User, mailchimpSecret: MailChimpSecrets): Promise<void> => {
    const { kfMailchimpListId, kfMailchimpUserName, kfMailchimpApiKey, kfDatasetSubscriptionListId } = mailchimpSecret;
    const mailChimpDataCenter = kfMailchimpApiKey.split('-')[1];
    const buff = new Buffer(`${kfMailchimpUserName}:${kfMailchimpApiKey}`);
    const b64 = buff.toString('base64');

    const urls = [];

    if (user.acceptedDatasetSubscriptionKfOptIn)
        urls.push(`https://${mailChimpDataCenter}.api.mailchimp.com/3.0/lists/${kfDatasetSubscriptionListId}/members/`);

    if (user.acceptedKfOptIn)
        urls.push(`https://${mailChimpDataCenter}.api.mailchimp.com/3.0/lists/${kfMailchimpListId}/members/`);

    await Promise.all(
        urls.map((url) =>
            fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${b64}`,
                },
                body: JSON.stringify({
                    email_address: user.email,
                    status: 'subscribed',
                    merge_fields: {
                        FNAME: user.firstName,
                        LNAME: user.lastName,
                    },
                }),
            }).then((res) => res.json()),
        ),
    ).catch((error) => {
        console.error(error);
    });
};
