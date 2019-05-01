import { newMailchimpSubscription } from "../services/mailChimp";
import { sendNihSubscriptionEmail } from "../services/nihEmail";

export default ({ emailSecret, mailchimpSecret }) => async (req, res) => {
  const { user = {} } = req.body;
  const { acceptedKfOptIn, acceptedNihOptIn, acceptedDatasetSubscriptionKfOptIn } = user;
  
  if (acceptedKfOptIn || acceptedDatasetSubscriptionKfOptIn) {
    await newMailchimpSubscription({ user, mailchimpSecret });
  }
  if (acceptedNihOptIn) {
    await sendNihSubscriptionEmail({ user, emailSecret });
  }
  res.end();
};
