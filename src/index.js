import "babel-polyfill";
import express from "express";
import {Server} from "http";
import cors from "cors";
import bodyParser from "body-parser";

import egoTokenMiddleware from "kfego-token-middleware";
import {subscribe, push, userList} from "./endpoints";
import {retrieveSecrets} from "./services/secrets";

import {version} from "../package.json";
import {port, egoURL, egoApi, sqsQueueUrl} from "./env";
import {getModel} from "./schema/User";
import connect from './services/mongo';
import graphqlHTTP from 'express-graphql';
import {createSchema} from "./graphql";
import {sendMessage, stubSendMessage} from "./services/sqs";
import AWS from 'aws-sdk';

const app = express();
const http = Server(app);
const sendSqs = sqsQueueUrl ? sendMessage(new AWS.SQS({apiVersion: '2012-11-05'}), sqsQueueUrl) : stubSendMessage;

Promise.all([
    connect(),
    retrieveSecrets()]
).then(([, secrets]) => {
    app.use(cors());
    app.use(bodyParser.json({limit: "50mb"}));
    app.get("/status", (req, res) => res.send({version, ego: egoURL}));
    app.use(
        egoTokenMiddleware({
            egoURL: egoApi,
            accessRules: [
                {
                    type: "allow",
                    route: ["/", "/*"]
                },
                {
                    type: "deny",
                    route: ["/push"]
                },
                {
                    type: "allow",
                    route: ["/push"],
                    role: ["admin"]
                },
                {
                    type: "deny",
                    route: ["/userlist"]
                },
                {
                    type: "allow",
                    route: ["/userList"],
                    role: ["admin"]
                }
            ]
        }),
    );
    const userModel = getModel(sendSqs);
    app.use((err, req, res, next) => {
        console.log(err);
        next(err);
    });
    app.use(
        '/graphql',
        graphqlHTTP((req, res) => {
            return {
                schema: createSchema({models: {User: userModel}}),
                formatError: err => {
                    console.error(err);
                    res.status(500);
                    return { message: 'Internal server error', statusCode: 500 };
                }
            };
        }));
    app.use("/subscribe", subscribe(secrets));
    app.get("/push", push(userModel, sendSqs));

    app.get("/userlist", userList(userModel));

    app.use(function (req, res, next) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    // error handler
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: req.app.get('env') === 'development' ? err.message : {},
        });
    });

    http.listen(port, () =>
        console.log(`⚡️⚡️⚡️ Listening on port ${port} ⚡️⚡️⚡️`)
    );
})
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
