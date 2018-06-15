import md5 from "crypto-js/md5";
import fetch from "node-fetch";
import { vaultClient, config as personaConfig } from "@overture-stack/persona";
import {
  vaultMailchimpSecretPath,
  kfMailchimpListId,
  kfMailchimpApiKey,
  kfMailchimpUserName
} from "../env";

const { useVault } = personaConfig;

let config = {
  kfMailchimpListId,
  kfMailchimpApiKey,
  kfMailchimpUserName
};

export const newMailchimpSubscription = async ({ user }) => {
  const { kfMailchimpListId, kfMailchimpApiKey, kfMailchimpUserName } = config;
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

export const retrieveMailchimpSecrets = async () =>
  useVault
    ? (await vaultClient())
        .read(vaultMailchimpSecretPath)
        .then(
          ({
            data: { kfMailchimpApiKey, kfMailchimpUserName, kfMailchimpListId }
          }) => {
            config = {
              ...config,
              kfMailchimpApiKey,
              kfMailchimpUserName,
              kfMailchimpListId
            };
          }
        )
        .catch(e => {
          console.error(e);
          console.warn(
            "failed to retrieve mailchimpCredential, falling back to environment config"
          );
        })
    : false;
