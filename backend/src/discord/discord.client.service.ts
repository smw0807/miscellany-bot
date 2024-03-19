import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import discordConfig from 'src/config/conf/discord.config';
import { Client, GatewayIntentBits } from 'discord.js';

@Injectable()
export class DiscordClientService {
  private readonly logger = new Logger(DiscordClientService.name);

  constructor(
    @Inject(discordConfig.KEY) private config: ConfigType<typeof discordConfig>,
  ) {
    this.setupDiscordBot();
  }

  private setupDiscordBot() {
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    client.on('ready', () => {
      this.logger.log(`Logged in as ${client.user.tag}!`);
    });
    client.on('message', (msg) => {
      if (msg.content === 'ping') {
        msg.reply('pong');
      }
    });
    client.login(this.config.DISCORD_TOKEN);
  }

  public test(): string {
    return 'Hello, World!';
  }
}
