import nodemailer from "nodemailer";
import { vaultClient, config as personaConfig } from "@overture-stack/persona";
import {
  vaultEmailSecretPath,
  nihSubscriptionMailTargetAddress,
  nihSubscriptionMailFromAddress,
  nihSubscriptionMailUserName,
  nihSubscriptionMailPass
} from "../env";

const { useVault } = personaConfig;

const googleApiRequiredScopes = ["https://www.googleapis.com/auth/gmail.send"];

let config = {
  service: "gmail",
  auth: {
    user: nihSubscriptionMailUserName,
    pass: nihSubscriptionMailPass
  }
};

export const sendNihSubscriptionEmail = async ({ user }) =>
  new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport(config);
    const { email, firstName, lastName } = user;
    const mailOptions = {
      from: `"Kids First DRP " <${config.auth.user}>`, // sender address
      to: nihSubscriptionMailTargetAddress, // list of receivers
      subject: "Kids First DRP Registration", // Subject line
      text: `
      Full User Name: ${firstName} ${lastName}
      User Email: ${email}
      Date Opted IN: ${new Date().toString()}
      Source = Kids First DRP Registration` // plain text body
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      }
      resolve();
    });
  });

export const retrieveEmailSecrets = async () =>
  useVault
    ? (await vaultClient())
        .read(vaultEmailSecretPath)
        .then(({ data: { email, password } }) => {
          config = {
            ...config,
            auth: {
              ...config.auth,
              user: email,
              pass: password
            }
          };
        })
        .catch(e => {
          console.error(e);
          console.warn(
            "failed to retrieve nih email credentials, falling back to environment config"
          );
        })
    : false;
