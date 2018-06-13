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

export const retrieveSecrets = async () =>
  useVault
    ? [vaultEmailSecretPath, vaultMailchimpSecretPath].map(async secretPath =>
        (await vaultClient())
          .read(secretPath)
          .then(({ data }) => data)
          .catch(async e => {
            console.error(`failed to retrieve secret at ${secretPath}:`);
            console.error(e);
            process.exit();
          })
      )
    : [emailSecretFallback, mailchimpSecretFallback];
