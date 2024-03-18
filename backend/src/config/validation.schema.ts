import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  PROJECT_NAME: Joi.string().required(),
  APP_PORT: Joi.number().default(3000),
});
