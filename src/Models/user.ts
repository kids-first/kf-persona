import md5 from 'crypto-js/md5';
import { Model, model } from 'mongoose';
import { userSchema } from '../schema/User';
import { MODEL_USER_NAME } from '../constants';
import { User } from '../schema/userType';

export const getUserModelWithPostSave: (postSave) => Model<User> = (postSave) => {
    try {
        userSchema.pre('save', function (next) {
            const email = this.email;
            if (email) {
                this.hashedEmail = md5(email.trim().toLowerCase());
            }
            next();
        });

        userSchema.post('save', (doc) => {
            postSave(doc).catch((err) => {
                console.error(err);
            });
        });

        return model<User>(MODEL_USER_NAME, userSchema);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
        throw e;
    }
};

export const getUserModel: () => Model<User> = () => model<User>(MODEL_USER_NAME, userSchema);
