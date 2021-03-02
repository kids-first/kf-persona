import { newMailchimpSubscription } from '../services/mailChimp';

export default ({ mailchimpSecret }) => async (req, res, next) => {
  const { user = {} } = req.body;
  const { acceptedKfOptIn, acceptedDatasetSubscriptionKfOptIn } = user;

  try {
    if (acceptedKfOptIn || acceptedDatasetSubscriptionKfOptIn) {
      await newMailchimpSubscription({ user, mailchimpSecret });
    }
    res.end();
  } catch (err) {
    console.error('subscribe route ', err);
    next(err);
  }
};
