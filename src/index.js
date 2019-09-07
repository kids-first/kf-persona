import "babel-polyfill";
import express from "express";
import {Server} from "http";
import cors from "cors";
import bodyParser from "body-parser";

import egoTokenMiddleware from "kfego-token-middleware";
import {subscribe, push} from "./endpoints";
import {retrieveSecrets} from "./services/secrets";

import {version} from "../package.json";
import {port, egoURL, egoApi, sqsQueueUrl} from "./env";
import {userModel} from "./schema/User";
import connect from './services/mongo';
import graphqlHTTP from 'express-graphql';
import {createSchema} from "./graphql";
import AWS from 'aws-sdk'

const app = express();
const http = Server(app);
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

Promise.all([
    connect(),
    retrieveSecrets()]
).then(([, secrets]) => {
    app.use(cors());
    app.use(bodyParser.json({limit: "50mb"}));
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
                }
            ]
        }),
    );
    app.use(
        '/graphql',
        bodyParser.json(),
        graphqlHTTP((err, res) => ({
            schema: createSchema({models: {User: userModel}}),
            formatError: err => {
                res.status(err.status || 500);
                return err;
            }
        }))
    );
    app.use("/subscribe", subscribe(secrets));
    app.get("/status", (req, res) => res.send({version, ego: egoURL}));
    app.get("/push", push(userModel, sqs, sqsQueueUrl));

    //TODO These 2 last comes from persona. What should we do?
    // // catch 404 and forward to error handler
    // app.use(function(req, res, next) {
    //     var err: any = new Error('Not Found');
    //     err.status = 404;
    //     next(err);
    // });
    // // error handler
    // app.use(function(err, req, res, next) {
    //     res.status(err.status || 500);
    //     res.send({
    //         message: req.app.get('env') === 'development' ? err.message : {},
    //     });
    // });

    http.listen(port, () =>
        console.log(`⚡️⚡️⚡️ Listening on port ${port} ⚡️⚡️⚡️`)
    );
})
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
