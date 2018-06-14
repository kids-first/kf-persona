import md5 from "crypto-js/md5";
import fetch from "node-fetch";

export const newMailchimpSubscription = async ({ user, mailchimpSecret }) => {
  const {
    kfMailchimpListId,
    kfMailchimpUserName,
    kfMailchimpApiKey
  } = mailchimpSecret;
  const hash = md5(user.email.toLowerCase()).toString();
  const mailChimpDataCenter = kfMailchimpApiKey.split("-")[1];
  const buff = new Buffer(`${kfMailchimpUserName}:${kfMailchimpApiKey}`);
  const b64 = buff.toString("base64");
  return await fetch(
    `https://${mailChimpDataCenter}.api.mailchimp.com/3.0/lists/${kfMailchimpListId}/members/`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${b64}`
      },
      body: JSON.stringify({
        email_address: user.email,
        status: "subscribed",
        merge_fields: {
          FNAME: user.firstName,
          LNAME: user.lastName
        }
      })
    }
  ).then(res => res.json());
};
