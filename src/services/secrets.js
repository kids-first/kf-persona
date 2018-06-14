import { vaultClient, config as personaConfig } from "@overture-stack/persona";
const { useVault } = personaConfig;
import {
  vaultEmailSecretPath,
  vaultMailchimpSecretPath,
  // email secrets
  nihSubscriptionMailUserName as envNihSubscriptionMailUserName,
  nihSubscriptionMailPass as envNihSubscriptionMailPass,
  // mailchimp secrets
  kfMailchimpListId as envKfMailchimpListId,
  kfMailchimpApiKey as envKfMailchimpApiKey,
  kfMailchimpUserName as envKfMailchimpUserName
} from "../env";

const mailchimpSecretFallback = {
  kfMailchimpListId: envKfMailchimpListId,
  kfMailchimpApiKey: envKfMailchimpApiKey,
  kfMailchimpUserName: envKfMailchimpUserName
};

const emailSecretFallback = {
  user: envNihSubscriptionMailUserName,
  pass: envNihSubscriptionMailPass
};

export const retrieveSecrets = () =>
  useVault
    ? Promise.all(
        [vaultEmailSecretPath, vaultMailchimpSecretPath].map(async secretPath =>
          (await vaultClient())
            .read(secretPath)
            .then(({ data }) => data)
            .catch(e => {
              console.error(`failed to retrieve secret at ${secretPath}`);
              return Promise.reject(e);
            })
        )
      )
    : Promise.resolve([emailSecretFallback, mailchimpSecretFallback]);
