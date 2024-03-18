import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PROJECT_NAME: Joi.string().required(),
  APP_PORT: Joi.number().default(3000),
});
