import mongoose from './mongoose';

import { mongoHost, mongoDb, mongoUser, mongoPass } from '../env';

const getMongoCredentials = () => ({
    user: mongoUser,
    pass: mongoPass,
});

export const constructMongoUri = ({ includeDb = true } = {}): string => {
    const { user, pass } = getMongoCredentials();
    return `mongodb://${user && pass ? `${encodeURIComponent(user)}:${encodeURIComponent(pass)}@` : ''}${mongoHost}${
        includeDb ? `/${mongoDb}` : ``
    }`;
};

const connect: () => Promise<void> = async () => {
    const uri = constructMongoUri();
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    mongoose.set('useCreateIndex', true);

    // eslint-disable-next-line no-console
    console.log(`Connected to mongo at mongodb://${mongoHost}/${mongoDb}`);
};

export default connect;
