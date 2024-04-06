import { registerAs } from '@nestjs/config';

export default registerAs('common', () => ({
  NODE_ENV: process.env.NODE_ENV,
  projectName: process.env.PROJECT_NAME,
  sessionSecret: process.env.SESSION_SECRET,
  appPort: process.env.APP_PORT,
  webUrl: process.env.WEB_URL,
}));
