import Joi from 'joi';

export const createTodoSchema = Joi.object({
  description: Joi.string().min(1).required()
});