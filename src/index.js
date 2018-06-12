import "babel-polyfill";

import express from "express";
import { Server } from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { rainbow } from "chalk-animation";

import personaApi from "@overture-stack/persona";

import { port, egoURL } from "./env";
import userSchema from "./schema/User";

const app = express();
const http = Server(app);

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
personaApi({
  ego: {
    required: true,
    accessRules: [
      {
        type: "allow",
        route: ["/", "/(.*)"],
        role: ["admin", "user"]
      }
    ]
  },
  schemas: {
    User: userSchema
  },
  tags: { User: ["interests"] }
}).then(router => {
  app.use(router);
  http.listen(port, () => rainbow(`⚡️ Listening on port ${port} ⚡️`));
});
