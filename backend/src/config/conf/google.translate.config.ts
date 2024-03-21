import { registerAs } from '@nestjs/config';

export default registerAs('googleTranslate', () => ({
  GOOGLE_TRANSLATE_API_KEY: process.env.GOOGLE_TRANSLATE_API_KEY,
}));
