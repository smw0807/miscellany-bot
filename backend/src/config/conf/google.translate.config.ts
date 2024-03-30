import { registerAs } from '@nestjs/config';

export default registerAs('googleTranslate', () => ({
  googleTranslateApiKey: process.env.GOOGLE_TRANSLATE_API_KEY,
}));
