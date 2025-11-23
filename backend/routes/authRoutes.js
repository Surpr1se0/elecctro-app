import bcrypt from "bcrypt";
import Jwt from "@hapi/jwt";
import db from "../db/db.js";
import { registerSchema, loginSchema } from "./authValidation.js";

const SALT_ROUNDS = 10;

export function registerAuthRoutes(server) {
  // POST /users
  // POST /login
  // POST /logout
  // GET /me
  // PATCH /me
}
