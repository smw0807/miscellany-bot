import { registerAs } from '@nestjs/config';

export default registerAs('googleTranslate', () => ({
  GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
  GOOGLE_TRANSLATE_API_KEY: process.env.GOOGLE_TRANSLATE_API_KEY,
  GOOGLE_TRANSLATE_CLIENT_ID: process.env.GOOGLE_TRANSLATE_CLIENT_ID,
}));
