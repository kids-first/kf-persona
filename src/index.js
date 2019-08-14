import "babel-polyfill";
import express from "express";
import { Server } from "http";
import cors from "cors";
import bodyParser from "body-parser";

import personaApi from "@kfpersona/persona";
import egoTokenMiddleware from "kfego-token-middleware";
import { subscribe } from "./endpoints";
import { retrieveSecrets } from "./services/secrets";

import { version } from "../package.json";
import { port, egoURL } from "./env";
import userSchema from "./schema/User";

const app = express();
const http = Server(app);

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));

Promise.all([
  personaApi({
    ego: {
      accessRules: [
        {
          type: "allow",
          route: ["/", "/(.*)"]
        }
      ]
    },
    schemas: {
      User: userSchema
    },
    tags: { User: ["interests"] }
  }),
  retrieveSecrets()
])
  .then(([router, secrets]) => {
    app.use("/subscribe", egoTokenMiddleware({ egoURL }), subscribe(secrets));
    app.get("/status", (req, res) => res.send({ version, ego: egoURL }));
    app.use(router);
    http.listen(port, () =>
      console.log(`⚡️⚡️⚡️ Listening on port ${port} ⚡️⚡️⚡️`)
    );
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
