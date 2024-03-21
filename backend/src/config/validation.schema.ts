import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  PROJECT_NAME: Joi.string().required(),
  APP_PORT: Joi.number().default(3000),

  // Discord
  DISCORD_APPLICATION_ID: Joi.string().required(),
  DISCORD_PUBLIC_KEY: Joi.string().required(),
  DISCORD_TOKEN: Joi.string().required(),
  DISCORD_URL: Joi.string().required(),

  // GOOGLE TRANSLATE
  GOOGLE_PROJECT_ID: Joi.string().required(),
  GOOGLE_TRANSLATE_API_KEY: Joi.string().required(),
  GOOGLE_TRANSLATE_CLIENT_ID: Joi.string().required(),
});
