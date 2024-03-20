import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import discordConfig from 'src/config/conf/discord.config';
import {
  ApplicationCommandType,
  Client,
  GatewayIntentBits,
  Guild,
} from 'discord.js';

@Injectable()
export class DiscordClientService {
  private readonly logger = new Logger(DiscordClientService.name);
  // 봇 클라이언트
  private client: Client;
  // 봇 등록된 서버 목록
  private guildListMap = new Map<string, Guild>();
  // 봇 준비 완료 여부
  private isReady = false;

  constructor(
    @Inject(discordConfig.KEY) private config: ConfigType<typeof discordConfig>,
  ) {
    this.setupDiscordBot();
  }

  /**
   * 디스코드 봇 클라이언트 설정
   */
  private setupDiscordBot() {
    // 봇 클라이언트 생성
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds, // 서버 목록 조회
        GatewayIntentBits.GuildMessages, // 서버 메시지 조회
        GatewayIntentBits.MessageContent, // 메시지 내용 조회
      ],
    });

    // 봇 준비 완료 이벤트
    this.client.on('ready', () => {
      this.logger.log(`Logged in as ${this.client.user.tag}!`);
      this.isReady = true;
      this.getGuilds();
      // 컨텍스트 메뉴 추가
      this.createContextMenu();
    });
    this.client.on('error', (error) => {
      this.logger.error('Discord Error', error);
    });

    // 봇 로그인
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

  get ready() {
    return this.isReady;
  }

  getGuildInfo(guildId: string) {
    return this.guildListMap.get(guildId);
  }

  // 컨텍스트 메뉴 추가
  private async createContextMenu() {
    const guildId = '1098235615574769706';
    const guild = this.getGuildInfo(guildId);
    if (!guild) {
      this.logger.error('Guild not found');
      return;
    }
    await guild.commands.set([
      {
        name: '사용자 정보',
        type: ApplicationCommandType.User,
      },
    ]);
    await guild.commands.set([
      {
        name: '메시지 정보',
        type: ApplicationCommandType.Message,
      },
    ]);
  }
  // 컨텍스트메뉴 이벤트 리스너
  onContextMenu() {
    this.client.on('interactionCreate', async (interaction) => {
      console.log(interaction);
    });
  }
}
