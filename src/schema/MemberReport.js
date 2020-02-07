import mongoose from 'mongoose';
import {
  MAX_LENGTH_FOR_BLAME_DESCRIPTION,
  MODEL_USER_NAME
} from '../constants';

const Schema = mongoose.Schema;

export const memberReport = new Schema(
  {
    userReportingId: [{ type: Schema.Types.ObjectId, ref: MODEL_USER_NAME }],
    userBlamedId: [{ type: Schema.Types.ObjectId, ref: MODEL_USER_NAME }],
    description: {
      type: 'String',
      maxlength: MAX_LENGTH_FOR_BLAME_DESCRIPTION,
      stripHtmlTags: true
    },
    isEmailSent: {
      type: 'Boolean',
      required: true
    },
    receivedAt: 'Date',
    emailTo: 'String',
    isTransactionCompletedWithoutError: {
      type: 'Boolean',
      required: true
    }
  },
  { collection: 'membersReports' }
);
