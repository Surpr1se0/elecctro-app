import bcrypt from "bcrypt";
import Jwt from "@hapi/jwt";
import { db } from '../db/db.js';
import { registerSchema, loginSchema } from "./authValidation.js";

const SALT_ROUNDS = 10;

export function registerAuthRoutes(server) {
  // POST /users
  server.route({
    method: "POST",
    path: "/users",
    options: {
      description: "Register a new user",
      notes:
        "Receives the user details and creates a new account, returning a JWT token",
      tags: ["api"],
      validate: {
        payload: registerSchema,
        failAction: (request, h, err) => {
          h.response({ error: "invalid user payload", details: err.details })
            .code(400)
            .takeover();
        },
      },
      handler: async (request, h) => {
        const { email, password, name } = request.payload;

        // check if it exists
        const existing = await db("users").where({ email }).first();
        if (existing) {
          return h.response({ error: "Email already registered" }).code(409);
        }

        const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

        const [user] = await db("users")
          .insert({ email, password_hash, name })
          .returning(["id", "email", "name", "created_at"]);

        const token = Jwt.token.generate(
          {
            userId: user.id,
            email: user.email,
          },
          {
            key: "some_shared_secret",
            algorithm: "HS256",
          }
        );

        return h
          .response({
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              createdAt: user.created_at,
            },
            token,
          })
          .code(201);
      },
    },
  });

  // POST /login
  // POST /logout
  // GET /me
  // PATCH /me
}
