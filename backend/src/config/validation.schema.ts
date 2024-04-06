import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  PROJECT_NAME: Joi.string().required(),
  APP_PORT: Joi.number().default(3000),
  WEB_URL: Joi.string().required(),
  // CORS
  CORS_ORIGIN: Joi.string().required(),
  CORS_METHODS: Joi.string().required(),
  CORS_ALLOWED_HEADERS: Joi.string().required(),

  // Discord
  DISCORD_CLIENT_ID: Joi.string().required(),
  DISCORD_CLIENT_SECRET: Joi.string().required(),
  DISCORD_PUBLIC_KEY: Joi.string().required(),
  DISCORD_TOKEN: Joi.string().required(),
  DISCORD_INSTALL_URL: Joi.string().required(),
  DISCORD_REDIRECT_URL: Joi.string().required(),

  // GOOGLE TRANSLATE
  GOOGLE_TRANSLATE_API_KEY: Joi.string().required(),

  // SUPABASE
  SUPABASE_URL: Joi.string().required(),
  SUPABASE_API_KEY: Joi.string().required(),
});
