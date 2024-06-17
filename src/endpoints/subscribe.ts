import { NextFunction, Request, Response } from 'express';
import { newMailchimpSubscription } from '../services/mailChimp';
import { MailChimpSecrets } from '../services/secrets';

export default (mailchimpSecret: MailChimpSecrets) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { user = {} } = req.body;
        const { acceptedKfOptIn, acceptedDatasetSubscriptionKfOptIn } = user;

        try {
            console.info("Checking if user needs newsletter subscription")
            if (acceptedKfOptIn || acceptedDatasetSubscriptionKfOptIn) {
                console.info("Subscribing user to MailChimp newsletter")
                await newMailchimpSubscription(user, mailchimpSecret);
            }
            res.end();
        } catch (err) {
            console.error('subscribe route ', err);
            next(err);
        }
    };
