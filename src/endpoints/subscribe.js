import { newMailchimpSubscription } from "../services/mailChimp";
import { sendNihSubscriptionEmail } from "../services/nihEmail";

export default ({ emailSecret, mailchimpSecret }) => async (req, res) => {
  console.warn('subscribe route deactivated. ')
  res.end();
  //FIXME
/*  const { user = {} } = req.body;
  const { acceptedKfOptIn, acceptedNihOptIn, acceptedDatasetSubscriptionKfOptIn } = user;
  
  if (acceptedKfOptIn || acceptedDatasetSubscriptionKfOptIn) {
    await newMailchimpSubscription({ user, mailchimpSecret });
  }
  if (acceptedNihOptIn) {
    await sendNihSubscriptionEmail({ user, emailSecret });
  }
  res.end();*/
};
