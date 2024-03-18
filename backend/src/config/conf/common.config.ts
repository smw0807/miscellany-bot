import { registerAs } from '@nestjs/config';

export default registerAs('common', () => ({
  projectName: process.env.PROJECT_NAME,
  appPort: process.env.APP_PORT,
}));
