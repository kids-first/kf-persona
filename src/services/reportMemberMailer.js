import nodemailer from 'nodemailer';

const generateEmailBodyText = details => {
  const { userReporting, userBlamed, blameDescription } = details;
  const now = new Date();
  return `
      Reported by (first name, last name): ${userReporting.firstName} ${
      userReporting.lastName
  }
      User Email: ${userReporting.email}
      
      Blamed user (first name, last name): ${userBlamed.firstName} ${
      userBlamed.lastName
  }
      Blamed user email: ${userBlamed.email} 
      
      Blame description: ${blameDescription}
      
      Reported Date (local time): ${now.toString()}
      Reported Date (ISO): ${now.toISOString()}
      `;
};

export const reportMemberMailer = (emailSecret, details) => {
  //for easy testing in dev change config for one generated there : https://ethereal.email/create
  const config = {
    service: 'gmail',
    auth: emailSecret
  };

  const transporter = nodemailer.createTransport(config);

  const mailOptions = {
    from: `"Kids First Inappropriate Content Report " <${config.auth.user}>`,
    to: details.emailTo + 'test',
    subject: 'Kids FirstInappropriateContent Report',
    text: generateEmailBodyText(details)
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return reject(new Error(err));
      }
      return resolve({
        sent: true,
        info,
        err: null
      });
    });
  });
};
