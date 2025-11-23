import Hapi from "@hapi/hapi";
import Joi from "@hapi/joi";
import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import HapiSwagger from "hapi-swagger";
import HapiDBConnect from "hapi-plugin-pg";

import { setupRoutes } from "./routes/routes.js"

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  setupRoutes(server);

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
