import { registerAs } from '@nestjs/config';

export default registerAs('discord', () => ({
  DISCORD_APPLICATION_ID: process.env.DISCORD_APPLICATION_ID,
  DISCORD_PUBLIC_KEY: process.env.DISCORD_PUBLIC_KEY,
  DISCORD_URL: process.env.DISCORD_URL,
}));
