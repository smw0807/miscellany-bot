import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import discordConfig from 'src/config/conf/discord.config';
import { Client, GatewayIntentBits, Guild } from 'discord.js';

@Injectable()
export class DiscordClientService {
  private readonly logger = new Logger(DiscordClientService.name);

  // 봇 클라이언트
  private client: Client;
  // 봇 등록된 서버 목록
  private guildListMap = new Map<string, Guild>();

  constructor(
    @Inject(discordConfig.KEY) private config: ConfigType<typeof discordConfig>,
  ) {
    this.setupDiscordBot();
  }

  private setupDiscordBot() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    this.client.on('ready', () => {
      this.logger.log(`Logged in as ${this.client.user.tag}!`);
      this.getGuilds();
    });
    // this.client.on('messageCreate', (msg) => {
    //   this.logger.debug('messageCreate', msg);
    //   if (msg.content === 'ping') {
    //     msg.reply('pong');
    //   }
    // });
    this.client.login(this.config.DISCORD_TOKEN);
  }

  // 현재 봇이 추가된 서버 목록
  private getGuilds() {
    this.client.guilds.cache.forEach((guild: Guild) => {
      this.guildListMap.set(guild.id, guild);
    });
  }

  get clientInstance() {
    return this.client;
  }

  get guildList() {
    return this.guildListMap;
  }

  getGuildInfo(guildId: string) {
    return this.guildListMap.get(guildId);
  }
}
