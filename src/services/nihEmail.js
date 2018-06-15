import nodemailer from "nodemailer";
import {
  nihSubscriptionMailTargetAddress,
  nihSubscriptionMailFromAddress,
  nihSubscriptionMailUserName,
  nihSubscriptionMailPass
} from "../env";

const googleApiRequiredScopes = ["https://www.googleapis.com/auth/gmail.send"];

export const sendNihSubscriptionEmail = async ({ user, emailSecret }) =>
  new Promise((resolve, reject) => {
    const config = {
      service: "gmail",
      auth: emailSecret
    };
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
