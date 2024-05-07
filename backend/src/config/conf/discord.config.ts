import { registerAs } from '@nestjs/config';

export default registerAs('discord', () => ({
  discordApiUrl: process.env.DISCORD_API_URL,
  dicordClientID: process.env.DISCORD_CLIENT_ID,
  discordClientSecret: process.env.DISCORD_CLIENT_SECRET,
  discordPublicKey: process.env.DISCORD_PUBLIC_KEY,
  discordToken: process.env.DISCORD_TOKEN,
  discordInstallUrl: process.env.DISCORD_INSTALL_URL,
  discordRedirectUrl: process.env.DISCORD_REDIRECT_URL,
}));
