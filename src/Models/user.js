import md5 from 'crypto-js/md5';
import mongoose from 'mongoose';
import { userSchema } from '../schema/User';
import { MODEL_USER_NAME } from '../constants';

export const getUserModelWithPostSave = postSave => {
  userSchema.pre('save', next => {
    const email = this.email;
    if (email) {
      this.hashedEmail = md5(email.trim().toLowerCase());
    }
    next();
  });

  userSchema.post('save', doc => {
    postSave(doc).catch(err => {
      console.error(err);
    });
  });

  return mongoose.model(MODEL_USER_NAME, userSchema);
};

export const getUserModel = () => mongoose.model(MODEL_USER_NAME, userSchema);
