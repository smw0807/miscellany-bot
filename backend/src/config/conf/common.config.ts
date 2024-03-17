import { registerAs } from '@nestjs/config';

export default registerAs('common', () => ({
  projectName: process.env.PROJECT_NAME,
}));
