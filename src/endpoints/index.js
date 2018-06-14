import { newMailchimpSubscription } from "../services/mailChimp";
import { sendNihSubscriptionEmail } from "../services/nihEmail";

export const subscription = ({ emailSecret, mailchimpSecret }) => async (
  req,
  res
) => {
  const { user = {} } = req.body;
  const { acceptedKfOptIn, acceptedNihOptIn } = user;

  if (acceptedKfOptIn) {
    await newMailchimpSubscription({ user, mailchimpSecret });
  }
  if (acceptedNihOptIn) {
    await sendNihSubscriptionEmail({ user, emailSecret });
  }
  res.end();
};
