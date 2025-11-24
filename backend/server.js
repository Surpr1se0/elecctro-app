import Hapi from "@hapi/hapi";
import Jwt from "@hapi/jwt";
import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import HapiSwagger from "hapi-swagger";

import { setupRoutes } from "./routes/routes.js";
import { registerAuthRoutes } from "./routes/authRoutes.js";

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
    routes: {
      cors: { // add cors for react@5173
        origin: ["http://localhost:5173"],
        additionalHeaders: ["cache-control", "x-request-with"],
      },
    },
  });

  // Setup swagger
  const swaggerOptions = {
    info: {
      title: "Test API documentation",
      version: "1.0.0",
    },
    documentationPath: "/docs",
  };

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  // Register JWT tokens & strategy
  await server.register(Jwt);
  server.auth.strategy("my_jwt_strategy", "jwt", {
    keys: "some_shared_secret",
    verify: {
      aud: false,
      iss: false,
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: 14400, // 4hs
      timeSkewSec: 15,
    },
    validate: (artifacts, request, h) => {
      return {
        isValid: true,
        credentials: {
          userId: artifacts.decoded.payload.userId,
          email: artifacts.decoded.payload.email,
        },
      };
    },
  });

  // Register API routes
  registerAuthRoutes(server);
  setupRoutes(server);

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
