import Joi from "joi";

// POST /users - Register a new user
export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(1).required(),
});


// POST /login - login user
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});


// POST /logout - logout user
export const updateUserSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(6),
  name: Joi.string().min(1),
});



// Validate responses schema
export const userResponseSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  createdAt: Joi.date().iso().required()
});


// POST /users and POST /login
export const authResponseSchema = Joi.object({
  token: Joi.string().required(),
  user: userResponseSchema
});


// POST /logout 
export const logoutResponseSchema = Joi.object({
  message: Joi.string().required()
});