import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PROJECT_NAME: Joi.string().required(),
});
