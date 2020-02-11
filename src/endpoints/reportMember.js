import { reportMemberMailer } from '../services/reportMemberMailer';
import striptags from 'striptags';
import {
  MAX_LENGTH_FOR_BLAME_DESCRIPTION,
  INTERNAL_SERVER_ERROR_CODE,
  SUCCESS_CODE,
  BAD_REQUEST_CODE
} from '../constants';
import { supportEmail } from '../env';
import { getUserModel } from '../Models/user';
import { getMemberReportModel } from '../Models/memberReport';

// calling func will do 'u.x' instead of 'u._doc.x'
const extractNeededFieldsFromUserDoc = userDoc => {
  return {
    firstName: userDoc._doc.firstName,
    lastName: userDoc._doc.lastName,
    email: userDoc._doc.email
  };
};

const isDataValid = (userReportingId, userBlamedId, blameDescription) => {
  return (
    userReportingId &&
    userBlamedId &&
    blameDescription &&
    blameDescription.length <= MAX_LENGTH_FOR_BLAME_DESCRIPTION
  );
};

const reportMember = ({ emailSecret }) => async (req, res) => {
  const sendError = error =>
    res.status(INTERNAL_SERVER_ERROR_CODE).send({ error });
  const sendSuccess = msg => res.status(SUCCESS_CODE).send(msg);
  const sendBadRequest = msg => res.status(BAD_REQUEST_CODE).send(msg);

  const { userReportingId, userBlamedId, blameDescription } = req.body;

  const sanitizeDescription = striptags(blameDescription);

  if (!isDataValid(userReportingId, userBlamedId, sanitizeDescription)) {
    return sendBadRequest('Nothing reported');
  }

  const hasUserSameId = userReportingId === userBlamedId;
  if (hasUserSameId) {
    return sendBadRequest('Nothing reported. Because you are blaming yourself.');
  }

  try {
    const userModel = getUserModel();

    const foundUsers = await userModel
      .find({
        _id: {
          $in: [userReportingId, userBlamedId]
        }
      })
      .exec();

    if (foundUsers.length !== 2) {
      console.log(
        `There must be exactly 2 users. Found count = ${foundUsers.length || 0}`
      );
      return sendError('Nothing reported. An internal server error occurred.');
    }

    const userReporting = foundUsers.find(u => u._id.equals(userReportingId));
    const userBlamed = foundUsers.find(u => u._id.equals(userBlamedId));

    const memberReportDocToAdd = {
      userReportingId,
      userBlamedId,
      description: sanitizeDescription,
      isEmailSent: false,
      receivedAt: new Date(),
      emailTo: supportEmail,
      isTransactionCompletedWithoutError: false
    };

    const memberReportModel = getMemberReportModel();
    const newlyCreateDoc = await memberReportModel.create(
      memberReportDocToAdd,
      err => {
        if (err) {
          throw new Error(err);
        }
      }
    );

    const statusOk = await reportMemberMailer(emailSecret, {
      userReporting: extractNeededFieldsFromUserDoc(userReporting),
      userBlamed: extractNeededFieldsFromUserDoc(userBlamed),
      blameDescription: sanitizeDescription,
      emailTo: supportEmail
    });

    await memberReportModel.updateOne(
      { _id: newlyCreateDoc._id },
      {
        $set: {
          isTransactionCompletedWithoutError: statusOk.err === null,
          isEmailSent: statusOk.sent
        }
      }
    );
  } catch (e) {
    console.log(e.message || e);
    return sendError('Nothing reported. An internal server error occurred.');
  }
  sendSuccess('Inappropriate content was reported');
};

export default reportMember;
