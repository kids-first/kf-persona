import mongoose from 'mongoose';
import { memberReport } from '../schema/MemberReport';
import { MODEL_MEMBER_REPORT_NAME } from '../constants';

export const getMemberReportModel = () =>
  mongoose.model(MODEL_MEMBER_REPORT_NAME, memberReport);
