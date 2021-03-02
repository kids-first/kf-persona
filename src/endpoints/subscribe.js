import { newMailchimpSubscription } from '../services/mailChimp';
import { sendNihSubscriptionEmail } from '../services/nihEmail';
import { nodeEnv } from '../env';

const isPrd = () => nodeEnv.toLocaleLowerCase() === 'prd';

export default ({ emailSecret, mailchimpSecret }) => async (req, res, next) => {
  if (!isPrd()) {
    return res.end();
  }

  const { user = {} } = req.body;
  const {
    acceptedKfOptIn,
    acceptedNihOptIn,
    acceptedDatasetSubscriptionKfOptIn
  } = user;

  try {
    if (acceptedKfOptIn || acceptedDatasetSubscriptionKfOptIn) {
      await newMailchimpSubscription({ user, mailchimpSecret });
    }
    if (acceptedNihOptIn) {
      await sendNihSubscriptionEmail({ user, emailSecret });
    }
    res.end();
  } catch (err) {
    console.error('subscribe route ', err);
    next(err);
  }
};
