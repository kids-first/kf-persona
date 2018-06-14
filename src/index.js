import "babel-polyfill";
import express from "express";
import { Server } from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { rainbow } from "chalk-animation";

import personaApi from "@overture-stack/persona";
import egoTokenMiddleware from "ego-token-middleware";
import { subscription } from "./endpoints";
import { retrieveSecrets } from "./services/secrets";

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
  retrieveSecrets().catch(e => {
    console.error(e);
    process.exit(1);
  })
]).then(([router, [emailSecret, mailchimpSecret]]) => {
  app.use(
    "/subscribe",
    egoTokenMiddleware({ egoURL }),
    subscription({ emailSecret, mailchimpSecret })
  );
  app.use(router);
  http.listen(port, () => rainbow(`⚡️ Listening on port ${port} ⚡️`));
});
