import "babel-polyfill";
import express from "express";
import { Server } from "http";
import cors from "cors";
import bodyParser from "body-parser";

import egoTokenMiddleware from "kfego-token-middleware";
import {subscribe} from "./endpoints";
import {retrieveSecrets} from "./services/secrets";

import {version} from "../package.json";
import {port, egoURL, egoApi} from "./env";
import {userModel} from "./schema/User";
import connect from './services/mongo';
import graphqlHTTP from 'express-graphql';
import {reCreateSchema} from "./graphql";

const app = express();
const http = Server(app);


Promise.all([
    connect().then(() => {
        return reCreateSchema({models: {User: userModel}})
    }),
    retrieveSecrets()]
).then(([createSchema, secrets]) => {
    app.use(cors());
    app.use(bodyParser.json({limit: "50mb"}));
    app.use(
        egoTokenMiddleware({
            egoURL: egoApi,
            accessRules: [
                {
                    type: "allow",
                    route: ["/", "/(.*)"]
                }
            ]
        }),
    );
    app.use(
        '/graphql',
        bodyParser.json(),
        graphqlHTTP((err, res) => ({
            schema: createSchema(
                (() => {
                    const query = res.req.body.query.replace(/#.*\n/g, "");
                    const regexMatch = /user\(_id:\s*"(\w*)"/gi.exec(query);
                    return (regexMatch && regexMatch[1]) ? regexMatch[1] : null;
                })()
            ),
            formatError: err => {
                res.status(err.status || 500);
                return err;
            },
        })),
    );
    app.use("/subscribe", egoTokenMiddleware({egoURL}), subscribe(secrets));
    app.get("/status", (req, res) => res.send({version, ego: egoURL}));
    http.listen(port, () =>
        console.log(`⚡️⚡️⚡️ Listening on port ${port} ⚡️⚡️⚡️`)
    );
})
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
