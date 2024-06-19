import { NextFunction, Request, Response } from 'express';
import { newMailchimpSubscription } from '../services/mailChimp';
import { MailChimpSecrets } from '../services/secrets';

export default (mailchimpSecret: MailChimpSecrets) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { user = {} } = req.body;
        const { acceptedKfOptIn, acceptedDatasetSubscriptionKfOptIn } = user;

        try {
            if (acceptedKfOptIn || acceptedDatasetSubscriptionKfOptIn) {
                const subscriptionResponses = await newMailchimpSubscription(user, mailchimpSecret);
                res.status(200).json({ message: 'Subscription successful', subscriptions: subscriptionResponses });
            } else {
                res.status(200).json({ message: 'No subscription needed' });
            }
        } catch (err) {
            console.error('Subscribe route error:', err);
            next(err);
        }
    };
