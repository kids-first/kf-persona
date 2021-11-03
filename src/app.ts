import AWS from 'aws-sdk';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import * as gqlHTTP from 'express-graphql';
import Keycloak, { KeycloakConfig } from 'keycloak-connect';

import { subscribe, push, userList } from './endpoints';
import { keycloakUrl, sqsQueueUrl } from './env';
import { formatGraphQLError, unknownEndpointHandler, globalErrorLogger, globalErrorHandler } from './errors';
import { createSchema } from './graphql';
import { getUserModelWithPostSave } from './Models/user';
import { sendMessage, stubSendMessage } from './services/sqs';

import { version } from '../package.json';
import { Model } from 'mongoose';
import { User } from './schema/userType';
import { MailChimpSecrets } from './services/secrets';

export default function (keycloakConfig: KeycloakConfig, secrets: MailChimpSecrets): Application {
    const keycloak = new Keycloak({}, keycloakConfig);
    const sendSqs = sqsQueueUrl ? sendMessage(new AWS.SQS({ apiVersion: '2012-11-05' }), sqsQueueUrl) : stubSendMessage;
    const userModel: Model<User> = getUserModelWithPostSave(sendSqs);
    const graphqlSchema = createSchema(userModel);

    const app = express();

    app.use(
        cors({
            exposedHeaders: ['Content-Disposition'],
        }),
    );

    app.use(
        keycloak.middleware({
            logout: '/logout',
            admin: '/',
        }),
    );

    app.use(express.json({ limit: '50mb' }));

    app.get('/status', (_req, res) => res.send({ version, keycloak: keycloakUrl }));

    app.get('/push', keycloak.protect('realm:ADMIN'), push(userModel, sendSqs));

    app.get('/userlist', keycloak.protect('realm:ADMIN'), userList(userModel));

    app.use(
        '/graphql',
        keycloak.protect(),
        gqlHTTP.graphqlHTTP((_req: Request, _res: Response) => ({
            schema: graphqlSchema,
            customFormatErrorFn: formatGraphQLError,
        })),
    );

    app.use('/subscribe', subscribe(secrets));

    app.use(globalErrorLogger, unknownEndpointHandler, globalErrorHandler);

    return app;
}
