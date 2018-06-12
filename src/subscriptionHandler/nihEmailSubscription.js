import nodemailer from "nodemailer";
import { vaultClient, config as personaConfig } from "@overture-stack/persona";
import {
  vaultAppSecretPath,
  nihSubscriptionMailTargetAddress,
  nihSubscriptionMailFromAddress,
  nihSubscriptionMailUserName,
  nihSubscriptionMailPass
} from "../env";

const { useVault } = personaConfig;

let config = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: nihSubscriptionMailUserName,
    pass: nihSubscriptionMailUserName
  }
};

export const sendNihSubscriptionEmail = async ({ user }) =>
  new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport(config);
    const { email, firstName, lastName } = user;
    const mailOptions = {
      from: `"Kids First DRP " <${nihSubscriptionMailFromAddress}>`, // sender address
      to: nihSubscriptionMailTargetAddress, // list of receivers
      subject: "Kids First DRP Registration", // Subject line
      text: `Full User Name: ${firstName} ${lastName}
      User Email: ${email}
      Date Opted IN: ${new Date().toString()}
      Source = Kids First DRP Registration` // plain text body
    };
    console.log("mailOptions: ", mailOptions);
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
        .read(vaultAppSecretPath)
        .then(
          ({
            data: { nihSubscriptionMailUsername, nihSubscriptionMailPass }
          }) => {
            config = {
              ...config,
              auth: {
                ...config.auth,
                user: nihSubscriptionMailUsername,
                pass: nihSubscriptionMailPass
              }
            };
          }
        )
        .catch(e => {
          console.log(
            "failed to retrieve nih email credentials, falling back to environment config"
          );
          console.log(e);
        })
    : false;
