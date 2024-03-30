import { registerAs } from '@nestjs/config';

export default registerAs('discord', () => ({
  dicordClientID: process.env.DISCORD_CLIENT_ID,
  discordPublicKey: process.env.DISCORD_PUBLIC_KEY,
  discordToken: process.env.DISCORD_TOKEN,
  discordInstallUrl: process.env.DISCORD_INSTALL_URL,
  discordRedirectUrl: process.env.DISCORD_REDIRECT_URL,
}));
