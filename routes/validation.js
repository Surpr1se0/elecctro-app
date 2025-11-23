import Joi from 'joi';

export const createTodoSchema = Joi.object({
  description: Joi.string().min(1).required()
});

export const todoIdParamsSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});